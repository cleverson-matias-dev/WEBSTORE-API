import { RequestHandler } from 'express';
import sanitizeHtml from 'sanitize-html';

const options = { allowedTags: [], allowedAttributes: {} };

const sanitize = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], options);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]);
    }
  }
};

export const sanitizeMiddleware: RequestHandler = (req, res, next) => {
  [req.body, req.params, req.query].forEach(sanitize);
  next();
};
