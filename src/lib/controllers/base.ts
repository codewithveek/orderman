import { Context } from 'hono';
import { ZodError } from 'zod';

export class BaseController {
    protected success(c: Context, data: any, status: 200 | 201 = 200) {
        return c.json(data, status);
    }

    protected error(c: Context, message: string, status: 400 | 401 | 403 | 404 | 500 = 500) {
        return c.json({ error: message }, status);
    }

    protected validationError(c: Context, error: ZodError) {
        return c.json({ error: 'Validation Error', details: error.flatten() }, 400);
    }
}
