import Image from "next/image";

import { FrontPageCarousel } from "~/components/carousel";
import { api } from "~/trpc/server";
import { CategoryItem, TrendingItem } from "./_components/list-item";

export default async function Home() {
  const categories = await api.categories.all.query();
  const trendingItems = await api.items.trending.query();
  const carouselItems = await api.media.sliderImages.query();
  const banner = await api.media.banner.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {banner && (
        <div className="w-full h-[250px] relative mb-4 border-accent border-4">
          <Image fill src={banner.image} alt={banner.alt ?? "Banner"} />
        </div>
      )}

      <FrontPageCarousel
        slides={carouselItems.map((item) => item.image)}
        // options={{ delay: 2500 }}
      />

      {/* <CategoriesSelection /> */}

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <div className="flex items-center gap-4 justify-center mt-4">
          {categories.map((item) => (
            <CategoryItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* <RecentlyViewed /> */}

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-primary-foreground">
          Trending items
        </h2>

        <div className="flex items-center gap-4 justify-center mt-4">
          {trendingItems.map((item) => (
            <TrendingItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* <NewestCollections /> */}

      {/* <PromotionalOffers /> */}
    </main>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
