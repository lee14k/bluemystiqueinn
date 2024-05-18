export default function PhotoGallery() {
    const images = ["/newhsphoto1.jpg", "/newhsphotot2.jpg", "/newhsphoto3.jpg"];
    const photoRow = [
      "/newhsphoto4-min.jpg",
      "/newhsphoto5-min.jpg",
      "/newhsphoto6-min.jpg",
      "/hsone-min.jpg",
      "/hstwo-min.jpg",
      "/buffet-min.jpg",
    ];
  
    return (
      <div>
        <div className="grid grid-cols-3 grid-rows-1">
          {images.map((image, index) => (
            <div key={index} className="w-full ">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex my-10">
          {photoRow.map((image, index) => (
            <div key={index} className="w-full h-72 overflow-hidden">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-xl mx-24 other-font">
          Did you celebrate at Haley Station? Tag us on Facebook and Instagram
          @haley_station- we’d love to see photos of your special day!
        </p>
      </div>
    );
  }
  