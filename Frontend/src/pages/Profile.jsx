import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  cloneElement,
} from "react";
import { AuthContext } from "../provider/auth/authProvider";
import { EditIcon } from "../components/Icons";
import Chart from "chart.js/auto";
import {
  getUserStatistics,
  getTotalStatistics,
  getActivityStatistics,
} from "../api/user/statistics";
import ActivityCalendar from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const { user } = useContext(AuthContext);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [genreData, setGenreData] = useState([]);
  const [totalSummaries, setTotalSummaries] = useState(0);
  const COLORS = [
    "#8E7BEF",
    "#6C63FF",
    "#A28CD4",
    "#8884D8",
    "#BEA5DA",
    "#D3BCE3",
    "#EBDDF1",
    "#4C4F6A",
    "#6E7493",
    "#4E3693",
    "#765CDE",
  ];
  const minimalTheme = {
    dark: ["hsl(0, 0%, 100%)", "hsl(252,66%,62%)"],
  };
  const [activityData, setActivityData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getActivityStatistics();

        const now = new Date();
        const currentMonth = now.getMonth(); // 0-indexed: Jan = 0
        const currentYear = now.getFullYear();

        const filtered = data.filter((item) => {
          const itemDate = new Date(item.date);
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();

          // Exclude same month from *previous* year
          return !(itemMonth === currentMonth && itemYear === currentYear - 1);
        });

        const formatted = filtered.map((item) => ({
          date: item.date,
          count: item.level,
          level: item.level,
        }));
        setActivityData(formatted);
      } catch (error) {
        console.error("Error fetching activity statistics:", error);
      }
    }

    fetchActivity();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [genre, total] = await Promise.all([
          getUserStatistics(),
          getTotalStatistics(),
        ]);
        setGenreData(genre);
        setTotalSummaries(total);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(myChartRef, {
      type: "doughnut",
      data: {
        labels: genreData.map((g) => g.genre),
        datasets: [
          {
            label: "عدد القراءات",
            data: genreData.map((g) => g.count),
            backgroundColor: COLORS.slice(0, genreData.length),
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}`,
            },
          },
        },
      },
      plugins: [
        {
          id: "centerText",
          beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.save();

            const text = totalSummaries.toString();
            ctx.font = "bold 30px IBM Plex Sans Arabic";
            ctx.fillStyle = "#fff";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const centerX = width / 2;
            const centerY = height / 2;

            ctx.fillText(text, centerX, centerY);
            ctx.restore();
          },
        },
      ],
    });
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [genreData, totalSummaries]);
  return (
    <div className=" text-white min-h-screen p-6 flex flex-col  space-y-8">
      {/* Profile Info */}
      <div className="flex  w-full max-w-md items-center ">
        <div className="w-24 h-24 rounded-full  flex items-center justify-center relative">
          <div
            onClick={() => navigate("/edit-profile")}
            className="w-6 h-6 rounded-full absolute bottom-1 left-1 z-10 cursor-pointer  flex items-center justify-center"
          >
            <EditIcon />
          </div>
          <img
            src="assets/images/profile.png"
            alt="Profile"
            className="w-22 h-22 rounded-full object-cover"
          />
        </div>
        <div className="text-right mr-8">
          <h2 className="text-3xl font-bold">{user?.name}</h2>
        </div>
      </div>
      <p className="text-l text-white mt-1 ">جميع قراءاتك</p>
      {/* Chart Section */}
      <div className="w-28 max-w-md">
        <canvas ref={chartRef} className="w-30 h-30 sm:w-28 sm:h-28"></canvas>
      </div>
      {/* Genre Stats */}
      <div className="flex flex-wrap gap-4 mt-4">
        {genreData.map((item, index) => (
          <div
            key={item.genre}
            className="px-4 py-2 rounded-lg text-center min-w-[100px]"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          >
            <p className="text-white text-lg font-bold">{item.count}</p>
            <p className="text-white text-sm">{item.genre}</p>
          </div>
        ))}
      </div>
      {/* Activity Calendar */}
      <div className="mb-8 w-full relative">
        <h2 className="text-xl font-semibold text-white mb-4">
          التقويم السنوي
        </h2>
        {activityData.length > 0 ? (
          <div className="rtl-calendar-wrapper w-full bg-[#1C1F36] p-6 rounded-lg relative">
            <ActivityCalendar
              data={activityData}
              blockSize={14}
              blockMargin={4}
              fontSize={14}
              hideTotalCount={false}
              theme={minimalTheme}
              colorScheme="dark"
              showWeekdayLabels={true}
              showMonthLabels={true}
              maxLevel={1}
              weekStart={0}
              labels={{
                months: [
                  "يناير", // January first!
                  "فبراير",
                  "مارس",
                  "أبريل",
                  "مايو",
                  "يونيو",
                  "يوليو",
                  "أغسطس",
                  "سبتمبر",
                  "أكتوبر",
                  "نوفمبر",
                  "ديسمبر",
                ],
                weekdays: [
                  "الأحد", // Sunday first!
                  "الإثنين",
                  "الثلاثاء",
                  "الأربعاء",
                  "الخميس",
                  "الجمعة",
                  "السبت",
                ],
                totalCount: " إجمالي الأيام النشطة :{{count}}",
                legend: {
                  less: "أقل",
                  more: "أكثر",
                },
              }}
              renderBlock={(block, activity) => {
                const date = new Date(activity.date);
                const formattedDate = date.toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return cloneElement(block, {
                  "data-tooltip-id": "activity-tooltip",
                  "data-tooltip-content": `${formattedDate} `,
                });
              }}
            />
            <ReactTooltip id="activity-tooltip" />
          </div>
        ) : (
          <p>لا توجد بيانات نشاط متاحة</p>
        )}
      </div>
    </div>
  );
}
