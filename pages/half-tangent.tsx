import Head from 'next/head'

import { Canvas, ReactThreeFiber, extend } from "@react-three/fiber";
import { MapControls, Text } from '@react-three/drei';

import styles from '../styles/figure-five.module.css'
import { BufferGeometry, CircleGeometry, EllipseCurve, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import {Leva, useControls} from 'leva';

import { csc } from 'mathjs'

extend({ Line_: Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

const LABEL_LINES = 0xcccccc;
const PRIMARY_LINES = 0x000000;
const SECONDARY_LINES = 0x555555;

function angleBetweenPoints(p1:Vector2, p2:Vector2, p3:Vector2) {
  const a = Math.sqrt((p2.x - p3.x) ** 2 + (p2.y - p3.y) ** 2);
  const b = Math.sqrt((p1.x - p3.x) ** 2 + (p1.y - p3.y) ** 2);
  const c = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  
  return Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
}

function circumferencePoint(origin:Vector2, radius:number, angle:number) {
  const x = origin.x + Math.cos(angle) * radius;
  const y = origin.y + Math.sin(angle) * radius;

  return new Vector2(x, y);
}


function RealAxis() {
  const points = [];
  points.push( new Vector3( -2.5, 0, 0 ) );
  points.push( new Vector3( 2.5, 0, 0 ) );
  
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: SECONDARY_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
    </>
  );
}

function ImaginaryAxis() {
  const points = [];
  points.push(new Vector3(0, -1, 0));
  points.push(new Vector3(0, 2.5, 0));
  
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: SECONDARY_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
    </>
  );
}

function UnitCircle() {
  const curve = new EllipseCurve(0, 0, 1, 1, 0, Math.PI, false, 0);

  const points = curve.getPoints(50);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: PRIMARY_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
    </>
  );
}

type PointAttributes = {
  position: Vector2
  label: string
}

function Point(attributes:PointAttributes) {
  const { position, label } = attributes;

  const geometry = new CircleGeometry(.025);
  const material = new MeshBasicMaterial({ color: 0x00000 });

  return (
    <>
      <mesh geometry={geometry} position={new Vector3(position.x, position.y)} material={material}>
      <Text
        color={SECONDARY_LINES}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.075, .075, 0)}
        outlineColor={0xFFFFFF}
        font="/RobotoSlab-Regular.ttf"
        position={new Vector3(0 + .075, 0 + .075)}>
        {label}
      </Text>
      </mesh>
    </>
  );
}

type AngleAttributes = {
  origin: Vector2,
  angle: number,
  radius: number,
  label: string
}

function Angle(attributes:AngleAttributes) {
  const { origin, angle, radius, label } = attributes;

  const curve = new EllipseCurve(
    origin.x,
    origin.y,
    radius,
    radius,
    0,
    angle,
    false,
    0
  );

  const geometry = new BufferGeometry().setFromPoints(curve.getPoints(100));
  const material = new LineBasicMaterial({color: SECONDARY_LINES});
 
  return (
    <>
      <line_ geometry={geometry} material={material} />
      <Text
        color={SECONDARY_LINES}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.075, .075, 0)}
        outlineColor={0xFFFFFF}
        font="/RobotoSlab-Regular.ttf"
        position={new Vector3(origin.x + radius * Math.cos(angle/2), origin.y + radius * Math.sin(angle/2))}>
        {label}
      </Text>
    </>
  );
}

type SegmentAttributes = {
  start: Vector2,
  end: Vector2
}

function Segment(attributes:SegmentAttributes) {
  const { start, end } = attributes;

  const geometry = new BufferGeometry().setFromPoints([start, end]);
  const material = new LineBasicMaterial({color: SECONDARY_LINES});
 
  return (
    <>
      <line_ geometry={geometry} material={material}></line_>
    </>
  );
}

type HalTangentAttributes = {
  φ: number
}

function HalfTangent(attributes:HalTangentAttributes) {
  const { φ } = attributes;

  const o = new Vector2(0, 0);
  const p = circumferencePoint(o, 1, φ);

  const alpha = Math.atan2(p.y, p.x);
  const beta = alpha / 2;

  const a = new Vector2(-1, 0);
  const b = new Vector2(1, 0);
  const c = new Vector2(0, csc(alpha));
  const d = new Vector2(.5, 0);
  const e = new Vector2(0, Math.tan(beta));
  
  return (
    <>
      <UnitCircle/>

      <Point position={a} label="A"></Point>
      <Point position={b} label="B"></Point>
      <Point position={c} label="C"></Point>
      <Point position={d} label="D"></Point>
      <Point position={e} label="E"></Point>
      <Point position={o} label="O"></Point>
      <Point position={p} label="P"></Point>

      <Segment start={a} end={p} />
      <Segment start={o} end={p} />
      <Segment start={d} end={p} />
      <Segment start={b} end={p} />
      <Segment start={c} end={p} />

      <Angle origin={o} angle={alpha} radius={.2} label="β"/>
      <Angle origin={a} angle={beta} radius={.2} label="α"/>

    </>
  );
}

export default function Home() {

  const {φ} = useControls({
    φ: {
      value: Math.PI/4,
      label: "φ - phi",
      min: 0,
      max: Math.PI,
      step: 0.01
    }
  });

  return (
    <>
      <Head>
        <title>Half-angle Tangent</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.scene}>
          <Canvas
            shadows={true}
            className={styles.canvas}
            camera={{}}>

            <RealAxis></RealAxis>
            <ImaginaryAxis></ImaginaryAxis>
            <HalfTangent φ={φ}/>

            <MapControls></MapControls>
            <ambientLight intensity={2} />
            <spotLight position={[0, 0, 85]} intensity={5} angle={Math.PI} penumbra={.25}/>
          </Canvas>
          
          <Leva flat={true} hideCopyButton={true} titleBar={false} />
        </div>
      </main>
    </>
  )
}
