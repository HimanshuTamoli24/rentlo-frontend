import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid3X3,
  Table2,
  LoaderCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*                               URL PARAM HELPER                              */
/* -------------------------------------------------------------------------- */

function updateSearchParams(
  searchParams: URLSearchParams,
  setSearchParams: any,
  updater: (params: URLSearchParams) => void,
  replace = true,
) {
  const params = new URLSearchParams(searchParams);
  updater(params);
  setSearchParams(params, { replace });
}

/* -------------------------------------------------------------------------- */
/*                               CONTEXT & PROVIDER                            */
/* -------------------------------------------------------------------------- */

interface MainLayoutContextValue {
  view: "card" | "table";
  setView: (view: "card" | "table") => void;
  searchParams: URLSearchParams;
  setSearchParams: any;
  isMobile: boolean;
  tableDisabled?: boolean;
  cardDisabled?: boolean;
}

const MainLayoutContext = createContext<MainLayoutContextValue | null>(null);

export function useMainLayout() {
  const context = useContext(MainLayoutContext);
  if (!context) {
    throw new Error("MainLayout components must be used within MainLayout");
  }
  return context;
}

interface MainLayoutProviderProps {
  children: ReactNode;
  disableTable?: boolean;
  disableCard?: boolean;
  defaultView?: "card" | "table";
}

function MainLayoutProvider({
  children,
  disableTable = false,
  disableCard = false,
  defaultView = "card",
}: MainLayoutProviderProps) {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const [view, setView] = useState(() => {
    if (isMobile && !disableCard) return "card";
    const saved = localStorage.getItem("layoutView");
    if (saved === "card" && !disableCard) return "card";
    if (saved === "table" && !disableTable) return "table";
    return defaultView;
  });

  const handleViewChange = (nextView: "card" | "table") => {
    if (
      (nextView === "card" && disableCard) ||
      (nextView === "table" && disableTable)
    )
      return;
    setView(nextView);
    localStorage.setItem("layoutView", nextView);
  };

  const value = {
    view,
    setView: handleViewChange,
    searchParams,
    setSearchParams,
    isMobile,
    tableDisabled: disableTable,
    cardDisabled: disableCard,
  };

  return (
    <MainLayoutContext.Provider value={value}>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 w-full mx-auto max-w-[1600px] animate-in fade-in duration-500">
        {children}
      </div>
    </MainLayoutContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HEADER COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function MainLayoutTitle({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-4">
      <div className="space-y-1.5 ">
        {breadcrumb && (
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            {breadcrumb}
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

function MainLayoutHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between  pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MainLayoutStatusFilters({
  options = ["published", "draft", "archived"],
}: {
  options?: string[];
}) {
  const { searchParams, setSearchParams } = useMainLayout();
  const status = searchParams.get("status");

  function handleFilterChange(filter: string) {
    updateSearchParams(searchParams, setSearchParams, (params) => {
      params.set("status", filter);
      params.delete("page");
    });
  }

  function handleClearStatus() {
    updateSearchParams(searchParams, setSearchParams, (params) => {
      params.delete("status");
      params.delete("page");
    });
  }

  return (
    <div className="flex gap-2 items-center flex-wrap bg-muted/30 p-1 rounded-lg border w-fit">
      <Button
        size="sm"
        className="h-8 rounded-md text-xs font-bold"
        variant={status === null ? "default" : "ghost"}
        onClick={handleClearStatus}
      >
        All
      </Button>

      {options.map((item) => (
        <Button
          key={item}
          size="sm"
          className="h-8  rounded-md text-xs font-bold"
          variant={status === item ? "default" : "ghost"}
          onClick={() => handleFilterChange(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Button>
      ))}
    </div>
  );
}

function MainLayoutPagination({
  currentPage = 1,
  totalPages = 1,
  isFetching = false,
  isLimit = true,
  onPageChange,
}: {
  currentPage?: number;
  totalPages?: number;
  isFetching?: boolean;
  isLimit?: boolean;
  onPageChange?: (page: number) => void;
}) {
  const { searchParams, setSearchParams } = useMainLayout();
  const page = currentPage || 1;
  const currentLimit = parseInt(searchParams.get("limit") || "20", 10);

  function handlePageChange(newPage: number) {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      updateSearchParams(
        searchParams,
        setSearchParams,
        (params) => {
          params.set("page", String(newPage));
        },
        false,
      );
    }
  }

  function handleLimitChange(value: string) {
    updateSearchParams(
      searchParams,
      setSearchParams,
      (params) => {
        params.set("limit", value);
        params.set("page", "1");
      },
      false,
    );
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {isLimit && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="limit-select"
            className="text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            Items per page:
          </label>
          <Select
            value={String(currentLimit)}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger
              id="limit-select"
              className="h-8 w-fit min-w-[60px] border-0 shadow-none bg-transparent text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[60px]">
              {[1, 2, 3, 5, 10, 20, 50].map((item) => (
                <SelectItem key={item} value={String(item)} className="text-xs">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1 || isFetching}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex items-center px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
          {isFetching ? (
            <LoaderCircle className="size-3 animate-spin" />
          ) : (
            <>
              <span className="text-foreground font-bold">{page}</span>
              <span className="mx-1">of</span>
              <span>{totalPages}</span>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages || isFetching}
          onClick={() => handlePageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               FILTER COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function MainLayoutFilters({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MainLayoutSearch({
  placeholder = "Search...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { searchParams, setSearchParams } = useMainLayout();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams(searchParams, setSearchParams, (params) => {
        if (searchValue) params.set("search", searchValue);
        else params.delete("search");
        params.delete("page");
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className={cn(
          "pl-10 w-full md:w-72 shadow-none h-9 text-sm",
          className,
        )}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}

function MainLayoutViewToggle() {
  const { view, setView, tableDisabled, cardDisabled } = useMainLayout();

  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as "card" | "table")}
      className="hidden lg:block"
    >
      <TabsList className="h-9 bg-muted/50 p-1">
        <TabsTrigger
          value="table"
          disabled={tableDisabled}
          className="h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Table2 className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger
          value="card"
          disabled={cardDisabled}
          className="h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Grid3X3 className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ROOT COMPONENT                                */
/* -------------------------------------------------------------------------- */

function MainLayout({
  children,
  disableTable = false,
  disableCard = false,
  defaultView = "card",
}: MainLayoutProviderProps) {
  return (
    <MainLayoutProvider
      disableTable={disableTable}
      disableCard={disableCard}
      defaultView={defaultView}
    >
      {children}
    </MainLayoutProvider>
  );
}

// Attach sub-components
MainLayout.Title = MainLayoutTitle;
MainLayout.Header = MainLayoutHeader;
MainLayout.StatusFilters = MainLayoutStatusFilters;
MainLayout.Pagination = MainLayoutPagination;
MainLayout.Filters = MainLayoutFilters;
MainLayout.Search = MainLayoutSearch;
MainLayout.ViewToggle = MainLayoutViewToggle;
MainLayout.Loading = LoadingPage;
MainLayout.Error = ErrorPage;

export default MainLayout;
