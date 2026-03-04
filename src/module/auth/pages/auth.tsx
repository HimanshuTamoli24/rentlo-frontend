import Login from "./components/login/login";
import Register from "./components/register/register";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AuthPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-card shadow-sm outline-accent-foreground border-accent border-2  rounded-3xl overflow-hidden  ">
        {/* Left Side: Form Area */}
        <div className="w-full max-w-2xl mx-auto  p-2 flex flex-col justify-center min-h-[600px]   shadow-accent-foreground ">
          <div className="w-full bg-muted p-8 rounded-2xl">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Welcome to Rentlo
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to manage your rentals and visits effortlessly.
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full ">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white  rounded-xl text-primary  gap-x-0.5">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 min-h-[400px]">
                <TabsContent
                  value="login"
                  className="m-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Login />
                  </div>
                </TabsContent>

                <TabsContent
                  value="register"
                  className="m-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Register />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Side: Image/Branding Area */}
        <div className="hidden lg:block relative w-full h-full  group rounded-2xl ">
         <div className="">
           <img
            src="/images/auth.png"
            alt="Rentlo Dashboard Preview"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-99 rounded-2xl mt-2 pb-2"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-10 translate-y-0 transition-transform duration-500">
            <div className="inline-flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Your Property Partner
            </div>
            <h2 className="text-3xl font-semibold mb-3 leading-tight">
              Manage everything <br /> in one place.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              The modern way to track users, visits, and property metrics with a
              beautiful and intuitive interface.
            </p>
          </div>
         </div>
        </div>
      </div>
    </div>
  );
}
