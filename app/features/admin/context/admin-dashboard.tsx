import { createContext, PropsWithChildren, useContext, useState } from "react";

type BanData = {
  userId: string;
  reason: string;
  expirationDate: Date | undefined;
};
interface IAdminDashboardContext {
  loading?: string;
  banData: BanData;
  isBanDialogOpen: boolean;
  setIsBanDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: string | undefined) => void;
  setBanData: (banData: BanData) => void;
}
const AdminDashboardContext = createContext<IAdminDashboardContext | null>(
  null
);

export const AdminDashboardProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState<string | undefined>();
  const [banData, setBanData] = useState<BanData>({
    userId: "",
    reason: "",
    expirationDate: undefined,
  });
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);

  return (
    <AdminDashboardContext.Provider
      value={{
        loading,
        banData,
        isBanDialogOpen,
        setIsBanDialogOpen,
        setBanData,
        setLoading,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);

  if (context === null) {
    throw new Error(
      "useAdminDashboard must be used within a AdminDashboardProvider"
    );
  }

  return context;
};
