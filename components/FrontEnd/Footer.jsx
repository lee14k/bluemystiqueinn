import { Della_Respira } from "next/font/google";
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
const Footer = () => {
  return (
    <div className={`footerwrapper bg-orange-50 flex flex-col justify-center  `}>
      <div className="mx-24" >
        <h1 className={`${della.className} text-6xl`}>Blue Mystique Inn</h1>
        <p className="text-3xl">123 Main St, Manistique, MI 49854</p>
        <div className="flex flex-col text-xl">
        <span >(906) 221-5371</span>
        <span>bluemystiquerentals@gmail.com</span>
        <FacebookTwoToneIcon fontSize="large"/>
      </div>
      </div>
     
    </div>
  );
};
export default Footer;
