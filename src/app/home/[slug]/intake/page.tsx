"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jsonData from "./../../../../DataMakananTKPI.json";
import FoodCard from "@/app/components/foodcard/foodcard";

interface FoodData {
  nama: string;
  energi: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  serat: number;
}
interface FoodItem extends FoodData {
  quantity: number;
}

export default function Page() {
  // PLACEHOLDER BASED ON SCREEN SIZE
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getPlaceholder = () => {
    return isMediumScreen
      ? "Search Food or Drink name... "
      : "Search Food or Drink";
  };

  // FORM AND LIST HANDLER
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);

    // Filter data makanan berdasarkan nama makanan yang mengandung nilai input
    const filteredSuggestions: FoodItem[] = jsonData
      .filter((item: FoodData) =>
        item.nama.toLowerCase().includes(value.toLowerCase())
      )
      .map((item: FoodData) => ({
        ...(item as FoodItem), // Cast (ubah tipe) item ke tipe FoodItem untuk menyertakan properti 'quantity'
        quantity: 1, // Tambahkan properti 'quantity' dengan nilai 1 ke setiap item
      }));

    // Perbarui state suggestions dengan data yang sudah difilter dan diberi properti 'quantity'
    setSuggestions(filteredSuggestions);
  };

  const addFoodToConsumedList = (foodName: string) => {
    // Dapatkan data makanan berdasarkan nama makanan
    const foodData = getFoodData(foodName);

    if (foodData) {
      // Buat objek makanan baru dengan nama makanan dan jumlah default 1
      const { nama, ...rest } = foodData; // Destructure properti 'nama'
      const newFood: FoodItem = { nama: foodName, quantity: 1, ...rest }; // Rekonstruksi objek dengan properti 'nama'
      setConsumedFoods((prevFoods) => [...prevFoods, newFood]);
    } else {
      console.error(`Makanan dengan nama '${foodName}' tidak ditemukan.`);
    }
  };

  const removeFoodFromConsumedList = (foodName: string) => {
    // Perbarui state consumedFoods dengan menyaring makanan berdasarkan nama makanan
    setConsumedFoods((prevFoods) =>
      prevFoods.filter((food) => food.nama !== foodName)
    );
  };

  const getFoodData = (foodName: string): FoodData | undefined => {
    // Implementasi placeholder - ganti dengan logika pengambilan data sebenarnya
    // Cari dan kembalikan data makanan berdasarkan nama makanan dari array jsonData
    return jsonData.find((item: FoodData) => item.nama === foodName);
  };

  // ONCLICK BACK
  const router = useRouter();
  // const onClickBack = () => {
  //   router.back(); // or router.push('/home/a') if you want to navigate to that path specifically
  // }

  return (
    <>
      <Link href="/home/a">
        <div className="z-30 ps-4 md:ps-0 mx-auto absolute top-0 left-0 right-0 mt-8 md:mt-14 w-full max-w-5xl">
          <button
            type="button"
            className=" font-medium text-xl text-center flex items-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="">Back</span>
          </button>
        </div>
      </Link>
      <div className="px-4 min-h-screen gap-4 grid grid-rows-3 grid-flow-row scale-95">
        <div className="text-2xl lg:text-3xl font-semibold text-slate-700 text-center mb-2 row-start-1 self-end">
          How's Your Food Today?
        </div>
        {/* Search Bar */}
        <div id="search" className="w-full max-w-3xl mx-auto row-start-2">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="ms-1 w-6 h-6"
                  fill="#6b7280"
                  viewBox="0 -3.84 122.88 122.88"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  enableBackground="new 0 0 122.88 115.21"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path d="M29.03,100.46l20.79-25.21l9.51,12.13L41,110.69C33.98,119.61,20.99,110.21,29.03,100.46L29.03,100.46z M53.31,43.05 c1.98-6.46,1.07-11.98-6.37-20.18L28.76,1c-2.58-3.03-8.66,1.42-6.12,5.09L37.18,24c2.75,3.34-2.36,7.76-5.2,4.32L16.94,9.8 c-2.8-3.21-8.59,1.03-5.66,4.7c4.24,5.1,10.8,13.43,15.04,18.53c2.94,2.99-1.53,7.42-4.43,3.69L6.96,18.32 c-2.19-2.38-5.77-0.9-6.72,1.88c-1.02,2.97,1.49,5.14,3.2,7.34L20.1,49.06c5.17,5.99,10.95,9.54,17.67,7.53 c1.03-0.31,2.29-0.94,3.64-1.77l44.76,57.78c2.41,3.11,7.06,3.44,10.08,0.93l0.69-0.57c3.4-2.83,3.95-8,1.04-11.34L50.58,47.16 C51.96,45.62,52.97,44.16,53.31,43.05L53.31,43.05z M65.98,55.65l7.37-8.94C63.87,23.21,99-8.11,116.03,6.29 C136.72,23.8,105.97,66,84.36,55.57l-8.73,11.09L65.98,55.65L65.98,55.65z"></path>
                    </g>
                  </g>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-md lg:text-lg rounded-lg block w-full pl-12 lg:pl-16 p-2 lg:p-2.5 focus:outline-none ring-transparent"
                placeholder={`${getPlaceholder()}`}
                value={searchTerm}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
          <div
            className={`max-h-56 border-2 rounded-lg overflow-scroll ${
              searchTerm ? "" : "hidden"
            } ${suggestions.length ? "" : "hidden"}`}
          >
            <div
              id="dropdown"
              className={`z-10 w-full bg-white divide-y divide-gray-100 rounded-lg`}
            >
              <ul
                className="text-sm w-full text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {suggestions.map((item: FoodItem) => (
                  <li key={item.nama}>
                    <a
                      href="#"
                      className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => addFoodToConsumedList(item.nama)}
                    >
                      {item.nama}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row-start-3 w-full max-w-2xl mx-auto h-min max-h-96 overflow-scroll">
          <div className="text-2xl font-semibold text-center mb-6 text-slate-700">
            List Foods & Drinks Consumed
          </div>
          {consumedFoods.length ? (
            <>
              <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <FoodCard />
                {consumedFoods.map((food: FoodItem, index: number) => (
                  <li className="pb-3 sm:pb-4">
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-md font-medium text-gray-900 truncate">
                          {food.nama}
                        </p>
                        <div className="text-sm text-gray-500 truncate dark:text-gray-400 flex flex-wrap gap-x-3 mt-2">
                          <div className="">Protein: {food.protein * food.quantity}</div>
                          <div className="">Energi:{food.energi * food.quantity}</div>
                          <div className="">Karbohidrat:{food.karbohidrat * food.quantity}</div>
                          <div className="">Lemak: {food.lemak * food.quantity}</div>
                          <div className="">Serat:{food.serat * food.quantity}</div>
                        </div>
                      </div>
                      <div className="ms-4">
                        <input
                          type="number"
                          min="1"
                          value={food.quantity}
                          onChange={(e) =>
                            setConsumedFoods((prevFoods) =>
                              prevFoods.map((prevFood, idx) =>
                                idx === index
                                  ? {
                                      ...prevFood,
                                      quantity: parseInt(e.target.value),
                                    }
                                  : prevFood
                              )
                            )
                          }
                          className="w-16 py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="inline-flex items-center text-base font-normal text-gray-900 ms-2 me-6">
                        x100 grams
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          onClick={() => removeFoodFromConsumedList(food.nama)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="text-lg text-center text-slate-500">
                No food consumed, Huh?
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
