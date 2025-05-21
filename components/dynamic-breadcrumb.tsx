"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

const capitilizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export default function DynamicBreadCrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && <BreadcrumbSeparator />}
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLastSegment = index == pathSegments.length - 1;
          const displaySegment = segment.replace(/-/g, " ");
          const breadcrumbText = capitilizeFirstLetter(displaySegment);
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLastSegment ? (
                  <BreadcrumbPage>{breadcrumbText}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{breadcrumbText}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastSegment && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
