import { useState, useEffect } from "react";

export default function MyInfo() {
  const [info, setInfo] = useState(null);
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3341/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setInfo(data);
          setInfoList(
            data.data.map((item, index) => (
              <li key={index}>
                {item.name} — ${item.price}
              </li>
            ))
          );
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  if (!info || !info.data) return <p>No profile data available</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        style={{ fontSize: "64px" }}
        className="w-full flex flex-col justify-center items-center dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
      >
        <div>Product Info</div>
        <div>{infoList}</div>
      </div>
    </main>
  );
}
