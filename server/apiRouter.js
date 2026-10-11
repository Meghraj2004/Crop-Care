// CropCare Professional REST API Dispatcher & Router
// Handles routing, query parsing, request bodies, and standardized JSON responses

import { dbStore } from './data/store.js';

// Helper to parse JSON body from incoming Node / Connect request
const parseBody = (req) => {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
};

// Helper to send standardized JSON response
const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

export const apiMiddleware = async (req, res, next) => {
  // Only process routes that start with /api
  if (!req.url.startsWith('/api')) {
    return next();
  }

  // Parse URL and query params
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const query = Object.fromEntries(parsedUrl.searchParams.entries());
  const method = req.method.toUpperCase();

  // Helper matchers
  const matchPath = (pattern) => {
    // pattern can have :id
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  };

  try {
    // -------------------------------------------------------------
    // Health Check
    // -------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        service: 'CropCare Agricultural Advisory API',
        version: '2.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------
    // Dashboard Endpoints (Returns ONLY role-specific KPI data)
    // -------------------------------------------------------------
    if (pathname === '/api/dashboard/farmer' && method === 'GET') {
      const data = dbStore.getFarmerDashboard(query.farmerId);
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/dashboard/expert' && method === 'GET') {
      const data = dbStore.getExpertDashboard(query.expertId);
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/dashboard/admin' && method === 'GET') {
      const data = dbStore.getAdminDashboard();
      return sendJson(res, 200, { success: true, data });
    }

    // -------------------------------------------------------------
    // Issues Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/issues' && method === 'GET') {
      // Returns filtered list with total count
      const { data, total } = dbStore.getIssues(query);
      return sendJson(res, 200, { success: true, data, meta: { total, count: data.length } });
    }

    if (pathname === '/api/issues' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.title || !body.cropName) {
        return sendJson(res, 400, { success: false, error: 'Title and crop name are required.' });
      }
      const newIssue = dbStore.createIssue(body);
      return sendJson(res, 201, { success: true, data: newIssue });
    }

    // GET /api/issues/:id
    const issueMatch = matchPath('/api/issues/:id');
    if (issueMatch && method === 'GET') {
      const issue = dbStore.getIssueById(issueMatch.id);
      if (!issue) {
        return sendJson(res, 404, { success: false, error: 'Issue not found.' });
      }
      return sendJson(res, 200, { success: true, data: issue });
    }

    // POST /api/issues/:id/updates
    const updateMatch = matchPath('/api/issues/:id/updates');
    if (updateMatch && method === 'POST') {
      const body = await parseBody(req);
      const newUpdate = dbStore.addIssueUpdate(updateMatch.id, body);
      if (!newUpdate) {
        return sendJson(res, 404, { success: false, error: 'Target issue not found.' });
      }
      return sendJson(res, 201, { success: true, data: newUpdate });
    }

    // PATCH /api/issues/:id
    if (issueMatch && method === 'PATCH') {
      const body = await parseBody(req);
      const updated = dbStore.updateIssue(issueMatch.id, body);
      if (!updated) {
        return sendJson(res, 404, { success: false, error: 'Issue not found.' });
      }
      return sendJson(res, 200, { success: true, data: updated });
    }

    // -------------------------------------------------------------
    // Expert Responses Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/expert-responses' && method === 'GET') {
      const responses = dbStore.getExpertResponses(query);
      return sendJson(res, 200, { success: true, data: responses });
    }

    if (pathname === '/api/expert-responses' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.issueId || !body.diagnosis || !body.treatment) {
        return sendJson(res, 400, { success: false, error: 'Issue ID, diagnosis, and treatment are required.' });
      }
      const newResp = dbStore.createExpertResponse(body);
      return sendJson(res, 201, { success: true, data: newResp });
    }

    // -------------------------------------------------------------
    // Research Cases Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/research-cases' && method === 'GET') {
      const cases = dbStore.getResearchCases(query);
      return sendJson(res, 200, { success: true, data: cases });
    }

    if (pathname === '/api/research-cases' && method === 'POST') {
      const body = await parseBody(req);
      const newRc = dbStore.createResearchCase(body);
      return sendJson(res, 201, { success: true, data: newRc });
    }

    const rcMatch = matchPath('/api/research-cases/:id');
    if (rcMatch && method === 'GET') {
      const rc = dbStore.getResearchCaseById(rcMatch.id);
      if (!rc) {
        return sendJson(res, 404, { success: false, error: 'Research case not found.' });
      }
      return sendJson(res, 200, { success: true, data: rc });
    }

    if (rcMatch && method === 'PATCH') {
      const body = await parseBody(req);
      const updated = dbStore.updateResearchCase(rcMatch.id, body);
      if (!updated) {
        return sendJson(res, 404, { success: false, error: 'Research case not found.' });
      }
      return sendJson(res, 200, { success: true, data: updated });
    }

    // -------------------------------------------------------------
    // Departments Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/departments' && method === 'GET') {
      const depts = dbStore.getDepartments();
      return sendJson(res, 200, { success: true, data: depts });
    }

    if (pathname === '/api/departments' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name) {
        return sendJson(res, 400, { success: false, error: 'Department name is required.' });
      }
      const newDept = dbStore.createDepartment(body);
      return sendJson(res, 201, { success: true, data: newDept });
    }

    const deptMatch = matchPath('/api/departments/:id');
    if (deptMatch && method === 'DELETE') {
      const ok = dbStore.deleteDepartment(deptMatch.id);
      return sendJson(res, ok ? 200 : 404, { success: ok });
    }

    // -------------------------------------------------------------
    // Knowledge Base Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/knowledge-base' && method === 'GET') {
      const articles = dbStore.getKnowledgeArticles(query);
      return sendJson(res, 200, { success: true, data: articles });
    }

    const kbMatch = matchPath('/api/knowledge-base/:id');
    if (kbMatch && method === 'GET') {
      const article = dbStore.getKnowledgeArticleById(kbMatch.id);
      if (!article) {
        return sendJson(res, 404, { success: false, error: 'Article not found.' });
      }
      return sendJson(res, 200, { success: true, data: article });
    }

    const kbVoteMatch = matchPath('/api/knowledge-base/:id/vote');
    if (kbVoteMatch && method === 'POST') {
      const body = await parseBody(req);
      const article = dbStore.voteKnowledgeArticle(kbVoteMatch.id, Boolean(body.isHelpful));
      if (!article) {
        return sendJson(res, 404, { success: false, error: 'Article not found.' });
      }
      return sendJson(res, 200, { success: true, data: article });
    }

    // -------------------------------------------------------------
    // Notifications Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/notifications' && method === 'GET') {
      const notifs = dbStore.getNotifications(query);
      return sendJson(res, 200, { success: true, data: notifs });
    }

    const notifReadMatch = matchPath('/api/notifications/:id/read');
    if (notifReadMatch && method === 'PATCH') {
      const notif = dbStore.markNotificationRead(notifReadMatch.id);
      return sendJson(res, notif ? 200 : 404, { success: Boolean(notif), data: notif });
    }

    // -------------------------------------------------------------
    // Users & Scientist Approvals
    // -------------------------------------------------------------
    if (pathname === '/api/users' && method === 'GET') {
      const users = dbStore.getUsers(query);
      return sendJson(res, 200, { success: true, data: users });
    }

    const userStatusMatch = matchPath('/api/users/:id/status');
    if (userStatusMatch && method === 'PATCH') {
      const body = await parseBody(req);
      const user = dbStore.updateUserStatus(userStatusMatch.id, body.status);
      if (!user) {
        return sendJson(res, 404, { success: false, error: 'User not found.' });
      }
      return sendJson(res, 200, { success: true, data: user });
    }

    const userMatch = matchPath('/api/users/:id');
    if (userMatch && method === 'DELETE') {
      const ok = dbStore.deleteUser(userMatch.id);
      return sendJson(res, ok ? 200 : 404, { success: ok });
    }

    // Fallthrough for unmatched /api path
    return sendJson(res, 404, {
      success: false,
      error: `API route not found: ${method} ${pathname}`
    });

  } catch (error) {
    console.error("API error:", error);
    return sendJson(res, 500, {
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};
