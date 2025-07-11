import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import "./news-card.scss";

interface NewsCardProps {
  title?: string;
  date?: string;
  description: string;
  imageUrl?: string; // Made optional since it's not used in the component
}

export default function NewsCard({
  title,
  date,
  description,
  imageUrl,
}: NewsCardProps) {
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();

    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [description]);

  return (
    <div className="news-card">
      <Image src={imageUrl || niceImage} alt="News image" className="banner" width={1080} height={720} priority  />
      {date && <p className="date">{date}</p>}
      {title && <p className="title">{title}</p>}
      <p ref={contentRef} className="line-clamp-4">
        {description}
      </p>
      {isTruncated && (
        <Link href="#" className="text-primary-600 font-medium">
          En lire plus
        </Link>
      )}
    </div>
  );
}
