import MainHeader from "@/components/main-header";
import MainFooter from "@/components/main-footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingSpinner from "@/components/loading-spinner";
import SetLoading from "@/components/set-loading";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SetLoading />
      <MainHeader />
      <main>{children}</main>
      <MainFooter />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
