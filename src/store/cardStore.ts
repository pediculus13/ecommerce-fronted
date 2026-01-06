import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { StorageEnum } from "#/enum";

export interface CartItem {
	id: number;
	title: string;
	price: number;
	thumbnail: string;
	quantity: number;
}

type CartStore = {
	items: CartItem[];
	actions: {
		addToCart: (product: any, quantity?: number) => void;
		removeFromCart: (productId: number) => void;
		updateQuantity: (productId: number, quantity: number) => void;
		clearCart: () => void;
	};
};

const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			actions: {
				addToCart: (product, quantity = 1) => {
					const { items } = get();
					const existingItem = items.find((item) => item.id === product.id);

					if (existingItem) {
						set({
							items: items.map((item) =>
								item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
							),
						});
					} else {
						set({
							items: [
								...items,
								{
									id: product.id,
									title: product.title,
									price: product.price,
									thumbnail: product.thumbnail,
									quantity,
								},
							],
						});
					}

					toast.success(`${product.title} added to cart`);
				},
				removeFromCart: (productId) => {
					set({ items: get().items.filter((item) => item.id !== productId) });
				},
				updateQuantity: (productId, quantity) => {
					if (quantity <= 0) {
						get().actions.removeFromCart(productId);
					} else {
						set({
							items: get().items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
						});
					}
				},
				clearCart: () => set({ items: [] }),
			},
		}),
		{
			name: "cartStore",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ [StorageEnum.Cart]: state.items }),
		},
	),
);

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartCount = () =>
	useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
