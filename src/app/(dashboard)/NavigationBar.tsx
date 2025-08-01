"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import getCookie from "@/lib/getToken";
import { canAccess } from "@/lib/roleUtils";
import {
  AlertCircleIcon,
  BellIcon,
  Building2Icon,
  CalendarIcon,
  FactoryIcon,
  HouseIcon,
  PowerIcon,
  SettingsIcon,
  UserIcon,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavigationBar = () => {
  const [user, setUser] = useState<any>(null);
  const [currentPeriod, setCurrentPeriod] = useState<any>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_MS_INCIDENCIAS_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie("token");
      const res = await fetch(`${apiUrl}auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        document.cookie = `rol=${data.user.role}; path=/; max-age=${60 * 60 * 24}; samesite=lax${process.env.NODE_ENV === "production" ? "; secure" : ""}`;
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPeriod = async () => {
      const res = await fetch(`${apiUrl}periods/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPeriod(data);
        document.cookie = `periodo=${data.period_name}; path=/; max-age=${60 * 60 * 24}; samesite=lax${process.env.NODE_ENV === "production" ? "; secure" : ""}`;
      } else {
        setCurrentPeriod(null);
      }
    };
    fetchPeriod();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-2 bg-white shadow-sm">
      <div className="flex items-left gap-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/ollamani-logo.png"
            alt="Ollamani Grupo"
            width={177}
            height={60}
          />
        </Link>
        <span className="text-lg text-[#0047BA] font-medium py-4 px-3">
          <span className="font-bold text-[#0047BA]">
            Gestión de Cultura y Desarrollo
          </span>
          <span className="text-gray-400"> | </span>
          {currentPeriod ? (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 inline-block text-blue-900" />
              <span className="text-[#0047BA] font-semibold">
                {currentPeriod.period_name}
              </span>
              <span className="text-gray-400 text-xs ml-2">
                ({new Date(currentPeriod.period_start).toLocaleDateString()} -{" "}
                {new Date(currentPeriod.period_end).toLocaleDateString()})
              </span>
            </span>
          ) : (
            <span className="text-gray-400">Sin periodo actual</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-6 text-gray-400">
        <span className="text-gray-500 text-sm">
          Hola{" "}
          <span className="font-bold text-[#0047BA]">
            {user ? user.name : "..."}
          </span>
        </span>
        <Link href="/dashboard" className="flex items-center">
          <HouseIcon className="w-5 h-5" />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <SettingsIcon className="w-5 h-5" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col min-w-[260px] max-h-[400px] max-w-full overflow-y-auto overflow-x-hidden">
                  {canAccess(user?.role, "menu", "companies") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/companies"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <Building2Icon className="w-5 h-5" />
                        Compañías
                      </Link>
                    </NavigationMenuLink>
                  )}
                  {canAccess(user?.role, "menu", "offices") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/offices"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <FactoryIcon className="w-5 h-5" />
                        Oficinas
                      </Link>
                    </NavigationMenuLink>
                  )}
                  {canAccess(user?.role, "menu", "periods") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/periods"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <CalendarIcon className="w-5 h-5" />
                        Periodos de Pago
                      </Link>
                    </NavigationMenuLink>
                  )}
                  {canAccess(user?.role, "menu", "incidents") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/incidents"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <AlertCircleIcon className="w-5 h-5" />
                        Incidentes
                      </Link>
                    </NavigationMenuLink>
                  )}
                  {canAccess(user?.role, "menu", "employees") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/employees"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <UsersRound className="w-5 h-5" />
                        Empleados
                      </Link>
                    </NavigationMenuLink>
                  )}
                  {canAccess(user?.role, "menu", "users") && (
                    <NavigationMenuLink asChild>
                      <Link
                        href="/users"
                        className="px-4 py-2 hover:bg-accent rounded flex-row items-center gap-2"
                      >
                        <UserIcon className="w-5 h-5" />
                        Usuarios
                      </Link>
                    </NavigationMenuLink>
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <BellIcon className="w-5 h-5" />
        <PowerIcon
          className="w-5 h-5 cursor-pointer"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        />
      </div>
    </header>
  );
};

export default NavigationBar;
