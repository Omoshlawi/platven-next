import CustomProperyRequestForm from "@/components/CustomProperyRequestForm";
import PropertyRequestForm from "@/components/forms/properties/property-request";
import ImageDisplay from "@/components/ImageDisplay";
import ListLayoutWithSideBar from "@/components/layout/ListLayoutWithSideBar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSessionUser } from "@/lib/auth-utils";
import { formartCurrency } from "@/lib/utils";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { Bookmark, Calendar, Heart } from "lucide-react";
import moment from "moment/moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

const ShareProperty = dynamic(() => import('@/components/ShareProperty'), {
  ssr: false,
});


export async function generateMetadata({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id, listed: true, isActive: true, payment: { complete: true } },
    include: { type: true },
  });

  if (!property) return { title: "Property Not Found" };

  const ogImageUrl = `${siteConfig.url}/${property.images[0]}`;

  return {
    title: property.title,
    description: `Check out this ${property.type.title} in ${property.county}, ${property.subCounty}. Price: ${formartCurrency(Number(property.price))}`,
    openGraph: {
      title: property.title,
      description: `Check out this ${property.type.title} in ${property.county}, ${property.subCounty}. Price: ${formartCurrency(Number(property.price))}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    }
  };
}


const PropertyDetailPage: FC<PropsWithPathParams> = async ({
  params: { id },
}) => {
  const property = await prisma.property.findUnique({
    where: { id, listed: true, isActive: true, payment: { complete: true } },
    include: { type: true },
  });

  if (!property) return notFound();

  const relatedProperties = await prisma.property.findMany({
    include: { type: true },
    take: 8,
    orderBy: { updatedAt: "desc" },
  });

  const user = await getSessionUser();

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row gap-5 m-4">
          <div className="w-full lg:w-3/4">
            <ImageDisplay images={property.images} />
          </div>
          <div className="w-full hidden lg:block md:w-1/4 mt-5 md:mt-0">
            <CustomProperyRequestForm />
          </div>
        </div>
        <ListLayoutWithSideBar
          sideBar={
            <div className="p-4 shadow shadow-slate-300 dark:shadow-slaate-700 rounded-md space-y-4 hidden lg:block">
              <h1 className="font-bold text-xl">Request Property</h1>
              <PropertyRequestForm
                property={property as any}
                user={user as any}
              />
            </div>
          }
          reverse
        >
          <div className="flex flex-col space-y-2">
            <div className="p-4 shadow shadow-slate-300 dark:shadow-slate-700 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-bold text-xl">{property.title}</p>
                <div className="flex space-x-2 items-center">
                  <Button size={"icon"}>
                    <Bookmark />
                  </Button>
                  <Button size={"icon"}>
                    <Heart />
                  </Button>
                  <Button>
                    <ShareProperty propertyUrl={`${siteConfig.url}/properties/${property.id}`} title={`View this property on ${siteConfig.name}`}/>
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4">
                <Badge className="bg-green-700">
                  {property.status === "onRent" ? "On rent" : "On sale"}
                </Badge>
                <Badge className="bg-green-700">{property.type.title}</Badge>
              </div>
              <div className="opacity-50 flex space-x-3 items-center text-lg">
                <Calendar />
                {moment(property.createdAt).fromNow()}
              </div>
              <p className="font-bold text-xl">
                {formartCurrency(Number(property.price))}
              </p>
            </div>
            <div className="p-4 shadow shadow-slate-300 dark:shadow-slate-700 rounded-md space-y-4">
              <p className="font-bold text-xl">Property detail</p>
              <div className="space-y-3 ">
                <div className="grid grid-cols-2">
                  <span>County</span>
                  <span>{property.county}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span>Subcounty</span>
                  <span>{property.subCounty}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span>Landmark</span>
                  <span>{property.landMark}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span>Nature of road access</span>
                  <span>{property.roadAccessNature}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span>Size</span>
                  <span>{property.size}</span>
                </div>
              </div>
              <div className="bg-accent p-2">
                <MarkdownRenderer markdownContent={property.features ?? ""} />
              </div>
            </div>
            <div className="p-4 shadow shadow-slate-300 dark:shadow-slate-700 rounded-md space-y-4 block lg:hidden">
              <h1 className="font-bold text-xl">Request Property</h1>
              <PropertyRequestForm
                property={property as any}
                user={user as any}
              />
            </div>
            <div className="w-full lg:hidden mt-5">
              <CustomProperyRequestForm />
            </div>
            <div className="p-4 space-y-4">
              <p className="font-bold text-xl">Related properties</p>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
                {relatedProperties.map(
                  (
                    {
                      id,
                      title,
                      images,
                      price,
                      county,
                      subCounty,
                      type: { title: type },
                      status,
                    },
                    index,
                  ) => (
                    <div
                      key={index}
                      className="w-full border rounded-lg shadow relative"
                    >
                      <Badge className="absolute top-2 left-2 bg-green-700">
                        {status === "onRent" ? "On rent" : "On sales"}
                      </Badge>
                      <Link href={`/properties/${id}`}>
                        <img
                          className="rounded-t-lg"
                          src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${images[0]}`}
                          alt="product image"
                        />
                      </Link>
                      <div className="px-5 pb-5">
                        <Link href={`/properties/${id}`}>
                          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            {`${title}`}
                          </h5>
                        </Link>
                        <div className="flex flex-col justify-center mt-2.5 mb-5">
                          {`${county} ${subCounty}`}
                        </div>
                        <div className="flex items-center justify-between flex-wrap space-y-6">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formartCurrency(Number(price))}
                          </span>
                          <Link
                            href={`/properties/${id}`}
                            className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          >
                            View Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </ListLayoutWithSideBar>
      </div>
    </>
  );
};

export default PropertyDetailPage;
