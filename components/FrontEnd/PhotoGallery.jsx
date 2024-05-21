export default function PhotoGallery() {
  const images = [
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
    { src: "/bmstok.jpeg", heightClass: "h-auto" },
    { src: "/bmstok.jpeg", heightClass: "h-72" },
  ];

  return (
    <div className="p-4">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div key={index} className={`break-inside-avoid ${image.heightClass}`}>
            <img className="w-full h-full object-cover rounded-lg" src={image.src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
