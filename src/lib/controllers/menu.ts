import { BaseController } from "./base";
import { menuRepository } from "@/lib/repositories/menu";
import { Context } from "hono";
import { MenuItemInput } from "@/lib/validations/menu";

export class MenuController extends BaseController {
  async getMenuItems(c: Context) {
    const category = c.req.query("category");
    try {
      let items;
      if (category) {
        items = await menuRepository.findByCategory(category);
      } else {
        items = await menuRepository.findAll();
      }
      return this.success(c, items);
    } catch (e) {
      return this.error(c, "Failed to fetch menu items");
    }
  }

  async getMenuItem(c: Context) {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return this.error(c, "Invalid ID", 400);

    try {
      const item = await menuRepository.findById(id);
      if (!item) return this.error(c, "Not found", 404);
      return this.success(c, item);
    } catch (e) {
      return this.error(c, "Internal Server Error");
    }
  }

  async createMenuItem(c: Context) {
    try {
      const data = c.req.valid("json" as never) as MenuItemInput;
      const { available, ...rest } = data;
      const insertData = {
        ...rest,
        price: rest.price.toString(),
        available: available,
      };

      const result = await menuRepository.create(insertData);
      return this.success(c, result, 201);
    } catch (e) {
      return this.error(c, "Failed to create menu item");
    }
  }
}

export const menuController = new MenuController();
