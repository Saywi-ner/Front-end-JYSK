fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/products", { params });
      set({
        items:      data.items,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        isLoading:  false,
      });
    } catch (err) {
      // Вот твой блок с моками для тестов:
      set({ 
        items: [
          { id: 1, name: "Скандинавский диван JYSK-style", price: 12000, imageUrl: "https://placehold.co/300" },
          { id: 2, name: "Дубовый стол", price: 8500, imageUrl: "https://placehold.co/300" }
        ], 
        isLoading: false 
      });
    }
  }