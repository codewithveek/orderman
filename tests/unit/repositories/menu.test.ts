import { describe, it, expect, vi, beforeEach } from "vitest";
import { MenuRepository } from "@/lib/repositories/menu";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/db/schema";

// Mock the database client
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

describe("MenuRepository", () => {
  let repository: MenuRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new MenuRepository();
  });

  describe("findAll", () => {
    it("should return all menu items", async () => {
      const mockData = [
        { id: 1, name: "Pizza", category: "mains" },
        { id: 2, name: "Salad", category: "starters" },
      ];

      const fromMock = vi.fn().mockResolvedValue(mockData);
      const selectMock = vi.fn().mockReturnValue({ from: fromMock });
      (db.select as ReturnType<typeof vi.fn>).mockImplementation(selectMock);

      const result = await repository.findAll();

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe("findByCategory", () => {
    it("should return items for a specific category", async () => {
      const mockData = [{ id: 1, name: "Pizza", category: "mains" }];
      const category = "mains";

      const whereMock = vi.fn().mockResolvedValue(mockData);
      const fromMock = vi.fn().mockReturnValue({ where: whereMock });
      const selectMock = vi.fn().mockReturnValue({ from: fromMock });
      (db.select as ReturnType<typeof vi.fn>).mockImplementation(selectMock);

      const result = await repository.findByCategory(category);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(menuItems);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("should insert a new item and return it with id", async () => {
      const newItem = {
        name: "Burger",
        description: "Tasty",
        price: "10.00",
        category: "mains",
        imageUrl: "http://img",
        available: true,
      };
      const mockInsertId = 123;

      const valuesMock = vi
        .fn()
        .mockResolvedValue([{ insertId: mockInsertId }]);
      const insertMock = vi.fn().mockReturnValue({ values: valuesMock });
      (db.insert as ReturnType<typeof vi.fn>).mockImplementation(insertMock);

      const result = await repository.create(newItem);

      expect(db.insert).toHaveBeenCalledWith(menuItems);
      expect(valuesMock).toHaveBeenCalledWith(newItem);
      expect(result).toEqual({ id: mockInsertId, ...newItem });
    });
  });
});
