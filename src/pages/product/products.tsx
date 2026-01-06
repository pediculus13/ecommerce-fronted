import { useQuery } from "@tanstack/react-query";
import productService from "@/api/services/productService";
import { Icon } from "@/components/icon";
import { useCartActions } from "@/store/cardStore";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Text } from "@/ui/typography";

export default function ProductsGrid() {
	const { addToCart } = useCartActions();

	const handleAddToCart = (product: any) => {
		addToCart(product, 1);
	};

	const {
		data: productsData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["products"],
		queryFn: productService.getProducts,
	});

	if (isLoading)
		return (
			<div className="flex items-center justify-center py-20">
				<Text>Loading products...</Text>
			</div>
		);

	if (error) return <div className="text-center py-20 text-red-600">Error: {error.message}</div>;

	const products = productsData?.products || [];

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Productos</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{products.map((product) => {
					const discountPercent = product.discountPercentage || 0;
					const originalPrice = product.price;
					const discountedPrice = originalPrice * (1 - discountPercent / 100);

					return (
						<div
							key={product.id}
							className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative"
						>
							{/* Discount Badge */}
							{discountPercent > 0 && (
								<div className="absolute top-3 left-3 z-10">
									<Badge variant="destructive" className="text-sm font-bold px-2 py-1">
										-{discountPercent.toFixed(1)}%
									</Badge>
								</div>
							)}

							{/* Wishlist */}
							<div className="absolute top-3 right-3 z-10">
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
								>
									<Icon icon="solar:heart-linear" size={20} />
								</Button>
							</div>

							{/* Image */}
							<div className="relative bg-gray-50 p-8 flex items-center justify-center h-64">
								<img
									src={product.thumbnail || product.images?.[0]}
									alt={product.title}
									className="max-w-full max-h-full object-contain"
								/>
							</div>

							{/* Content */}
							<div className="p-5 flex flex-col flex-1">
								{/* Brand */}
								<Text variant="caption" color="secondary" className="mb-1 uppercase tracking-wider">
									{product.brand}
								</Text>

								{/* Title */}
								<Text variant="subTitle2" className="font-medium mb-2 line-clamp-1">
									{product.title}
								</Text>

								{/* Description */}
								<Text variant="body2" color="secondary" className="mb-4 line-clamp-2 text-sm">
									{product.description}
								</Text>

								{/* Pricing */}
								<div className="mt-auto">
									<div className="flex flex-wrap items-baseline gap-2 mb-3">
										<Text className="text-2xl font-bold text-green-700">S/ {discountedPrice.toFixed(2)}</Text>
										{discountPercent > 0 && (
											<>
												<Text className="text-sm text-gray-500 line-through">S/ {originalPrice.toFixed(2)}</Text>
												{discountPercent > 10 && (
													<Badge variant="outline" className="text-xs font-medium text-green-700 border-green-200">
														Oferta
													</Badge>
												)}
											</>
										)}
									</div>

									{/* Rating */}
									{product.rating && (
										<div className="flex items-center gap-1 mb-3">
											<div className="flex text-amber-400">
												{[...Array(5)].map((_, i) => (
													<Icon
														key={`${product.id}-${i}`}
														icon={i < Math.floor(product.rating) ? "ic:star" : "solar:star-linear"}
														size={16}
													/>
												))}
											</div>
											<Text variant="caption" className="text-gray-600">
												({product.rating.toFixed(1)})
											</Text>
										</div>
									)}

									{/* Actions */}
									<div className="flex items-center gap-3">
										<Button
											className="flex-1 bg-green-600 hover:bg-green-700"
											size="lg"
											onClick={() => handleAddToCart(product)}
										>
											Agregar al carrito
										</Button>
									</div>

									{/* Stock */}
									{product.stock && (
										<Text
											variant="caption"
											className="mt-2 text-center"
											color={product.stock < 10 ? "error" : "secondary"}
										>
											{product.stock < 10 ? `Solo ${product.stock} disponibles` : "Disponible"}
										</Text>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
