import type { CSSProperties } from "react";
import { useState } from "react";
import CyanBlur from "@/assets/images/background/cyan-blur.png";
import RedBlur from "@/assets/images/background/red-blur.png";
import { Icon } from "@/components/icon";
import { useCartCount, useCartItems } from "@/store/cardStore";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Text } from "@/ui/typography";

export default function ShoppingCartButton() {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const cartCount = useCartCount();

	const cartItems = useCartItems();

	const style: CSSProperties = {
		backdropFilter: "blur(20px)",
		backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
		backgroundRepeat: "no-repeat, no-repeat",
		backgroundPosition: "right top, left bottom",
		backgroundSize: "50%, 50%",
	};

	const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return (
		<>
			<Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setDrawerOpen(true)}>
				<Icon icon="local:ic-shopping" size={24} />
				{cartCount > 0 && (
					<Badge variant="destructive" shape="circle" className="absolute -right-2 -top-2">
						{cartCount}
					</Badge>
				)}
			</Button>
			{cartCount > 0 && (
				<Badge variant="destructive" shape="circle" className="absolute -right-2 -top-2">
					{cartCount}
				</Badge>
			)}

			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent side="right" className="sm:max-w-md p-0 [&>button]:hidden flex flex-col" style={style}>
					<SheetHeader className="flex flex-row items-center justify-between p-4 h-16 shrink-0">
						<SheetTitle>Shopping Cart</SheetTitle>
						{cartCount > 0 && (
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full text-primary"
								onClick={() => {
									// setCartCount(0);
								}}
							>
								<Icon icon="solar:trash-bin-minimalistic-bold" size={20} />
							</Button>
						)}
					</SheetHeader>

					<div className="px-4 flex-1 overflow-hidden">
						{cartItems.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center">
								<Icon icon="local:ic-shopping" size={64} className="text-muted-foreground mb-4" />
								<Text variant="subTitle1" color="secondary">
									Your cart is empty
								</Text>
							</div>
						) : (
							<ScrollArea className="h-full">
								<div className="space-y-4 pb-4">
									{cartItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0"
										>
											<div className="w-16 h-16 bg-bg-neutral rounded-lg flex items-center justify-center">
												<img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover rounded-lg" />
											</div>
											<div className="flex-1">
												<Text variant="subTitle2">{item.title}</Text>
												<Text variant="caption" color="secondary">
													{item.quantity} × S/ {item.price.toFixed(2)}
												</Text>
											</div>
											<Text variant="subTitle2">S/ {(item.price * item.quantity).toFixed(2)}</Text>
										</div>
									))}
								</div>
							</ScrollArea>
						)}
					</div>

					{cartItems.length > 0 && (
						<SheetFooter className="flex flex-col p-4 shrink-0 space-y-4">
							<div className="flex justify-between items-center">
								<Text variant="subTitle1">Total</Text>
								<Text variant="subTitle1" className="font-semibold">
									${total.toFixed(2)}
								</Text>
							</div>
							<div className="flex space-x-2">
								<Button variant="outline" className="flex-1">
									Continue Shopping
								</Button>
								<Button className="flex-1">Checkout</Button>
							</div>
						</SheetFooter>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
