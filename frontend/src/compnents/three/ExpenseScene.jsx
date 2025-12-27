// frontend/src/components/three/ExpenseScene.jsx

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import { useMemo } from "react";

function CategoryBar({ position, height, color, label, amount }) {
  const topY = height / 2;

  return (
    <>
      <Float speed={0.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[position[0], topY, position[2]]}>
          <boxGeometry args={[0.35, height, 0.35]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.7}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </Float>
      <Html
        position={[position[0], height + 0.4, position[2]]}
        center
        style={{
          color: "#fef9c3",
          fontSize: "10px",
          fontFamily: "system-ui",
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow: "0 0 10px rgba(0,0,0,0.9)",
          fontWeight: 600,
        }}
      >
        <div>
          <div>{label}</div>
          <div style={{ opacity: 0.8 }}>₹{amount.toLocaleString("en-IN")}</div>
        </div>
      </Html>
    </>
  );
}

function WalletCoin({ total }) {
  return (
    <Float speed={0.6} rotationIntensity={0.5} floatIntensity={0.4}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.28, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={1}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      <Html
        position={[0, 0.05, 0]}
        center
        style={{
          color: "#0f172a",
          fontSize: "11px",
          fontFamily: "system-ui",
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <div>
          <div style={{ fontSize: 9, opacity: 0.7 }}>This month</div>
          <div>₹{total.toLocaleString("en-IN")}</div>
        </div>
      </Html>
    </Float>
  );
}

export default function ExpenseScene({ categories }) {
  const { bars, total } = useMemo(() => {
    if (!categories || categories.length === 0) {
      return {
        total: 0,
        bars: [],
      };
    }

    const maxAmount =
      Math.max(...categories.map((c) => c.amount || 0)) || 1;
    const totalAmount = categories.reduce(
      (sum, c) => sum + (c.amount || 0),
      0
    );

    const bars = categories.map((cat, index) => {
      const angle = (index / categories.length) * Math.PI * 2;
      const radius = 2.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const minHeight = 0.6;
      const extraHeight = 1.6 * (cat.amount / maxAmount);
      const height = minHeight + extraHeight;

      const palette = [
        "#facc15", // gold
        "#f97316", // warm orange
        "#fde68a", // soft gold
        "#fb923c",
        "#eab308",
      ];
      const color = palette[index % palette.length];

      return {
        label: cat.label,
        amount: cat.amount,
        height,
        position: [x, 0, z],
        color,
      };
    });

    return { bars, total: totalAmount };
  }, [categories]);

  const hasData = bars.length > 0;

  return (
    <div className="relative w-full h-72 rounded-3xl border border-[#f59e0b]/25 bg-[#02010a] overflow-hidden shadow-[0_26px_80px_rgba(0,0,0,0.9)]">
      {/* rich black + gold glow + grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(248,113,113,0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] bg-[linear-gradient(to_right,#090814_1px,transparent_1px),linear-gradient(to_bottom,#090814_1px,transparent_1px)] bg-[size:46px_46px]" />

      <Canvas camera={{ position: [0, 4.2, 6.2], fov: 45 }}>
        <color attach="background" args={["#02010a"]} />
        <ambientLight intensity={0.7} />
        <spotLight
          position={[6, 10, 4]}
          angle={0.6}
          intensity={1.6}
          color="#f59e0b"
          penumbra={0.5}
        />
        <spotLight
          position={[-6, 8, -4]}
          angle={0.7}
          intensity={1.2}
          color="#f97316"
          penumbra={0.6}
        />

        {/* base disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <cylinderGeometry args={[3.1, 3.1, 0.12, 64]} />
          <meshStandardMaterial
            color="#020617"
            metalness={0.7}
            roughness={0.6}
          />
        </mesh>

        {hasData ? (
          <>
            <WalletCoin total={total} />
            {bars.map((bar, idx) => (
              <CategoryBar key={idx} {...bar} />
            ))}
          </>
        ) : (
          <Html
            center
            style={{
              color: "#fef3c7",
              fontSize: "12px",
              fontFamily: "system-ui",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Add a few expenses to see your golden spend ring ✨
          </Html>
        )}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
