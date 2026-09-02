import { useEffect, useRef } from "react";
import "../assets/styles/Hero.css";

const FRAME_COUNT = 61;

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const imagesRef = useRef([]);
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");

    const images = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();

      img.src = `/hero-frames/frame-${String(i).padStart(3, "0")}.webp`;

      images.push(img);
    }

    imagesRef.current = images;

    const drawFrame = (index) => {
      const img = images[index];

      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      const scale = Math.max(
        canvasWidth / img.width,
        canvasHeight / img.height
      );

      const width = img.width * scale;
      const height = img.height * scale;

      const x = (canvasWidth - width) / 2;
      const y = (canvasHeight - height) / 2;

      ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      ctx.drawImage(
        img,
        x,
        y,
        width,
        height
      );
    };

    images[0].onload = () => {
      drawFrame(0);
    };

    const animate = () => {
      const difference =
        targetFrame.current -
        currentFrame.current;

      currentFrame.current += difference * 0.15;

      const frame =
        Math.round(currentFrame.current);

      if (frame !== currentFrame.current) {
        currentFrame.current = frame;
      }

      drawFrame(frame);

      animationRef.current =
        requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const rect =
        section.getBoundingClientRect();

      const scrollDistance =
        section.offsetHeight -
        window.innerHeight;

      const progress =
        Math.min(
          Math.max(
            -rect.top / scrollDistance,
            0
          ),
          1
        );

      targetFrame.current =
        progress * (FRAME_COUNT - 1);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => drawFrame(
        Math.round(currentFrame.current)
      )
    );

    animate();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      cancelAnimationFrame(
        animationRef.current
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero"
    >
      <div className="hero-sticky">

        <canvas
          ref={canvasRef}
          className="hero-canvas"
        />

        <div className="hero-overlay" />

        <div className="hero-content">

          <span className="hero-eyebrow">
            کالکشن جدید نسیم
          </span>

          <h1>
            خاص باش
            <br />
            <span>با استایل خودت</span>
          </h1>

          <p>
            جدیدترین مدل‌های شومیز، کراپ و لباس‌های زنانه
            <br />
            طراحی شده برای درخشش روزمره شما.
          </p>

          <button className="shop-button">
            شروع خرید
            <span>←</span>
          </button>

        </div>

        <div className="scroll-indicator">
          <span>اسکرول</span>
          <div className="scroll-line" />
          <span>↓</span>
        </div>

      </div>
    </section>
  );
}