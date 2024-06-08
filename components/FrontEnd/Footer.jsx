import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
const Footer = () => {
  return (
    <div className={`footerwrapper `}>
      <div >
        <h1 className={`${della.className} text-6xl`}>Blue Mystique Inn</h1>
        <p>123 Main St, Manistique, MI 49854</p>
      </div>
      <div className="flex flex-col">
        <span>(906) 221-5371</span>
        <span>bluemystiquerentals@gmail.com</span>
      </div>
    </div>
  );
};
export default Footer;
