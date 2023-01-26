import Head from 'next/head'

import { Canvas, ReactThreeFiber, extend } from "@react-three/fiber";
import { MapControls, Text } from '@react-three/drei';

import styles from '../styles/figure-five.module.css'
import { BufferGeometry, CircleGeometry, EllipseCurve, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import {Leva, useControls} from 'leva';

import { cot, csc, distance, sqrt } from 'mathjs'
import { constants } from 'crypto';

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

type CircleCurveAttributes = {
  radius: number,
  origin: Vector2,
  start: number,
  end: number
}

function CircleCurve({radius, origin, start, end}: CircleCurveAttributes) {
  const curve = new EllipseCurve(origin.x, origin.y, radius, radius, start, end, false, 0);

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

type ImaginaryAxisLabelAttributes = {
  height: number
}

function ImaginaryAxisLabel({height}:ImaginaryAxisLabelAttributes) {
  if(height < 2.5) {
    return (
      <>
        <Text
          color={SECONDARY_LINES}
          anchorX="center"
          anchorY="bottom"
          scale={new Vector3(.05, .05, 0)}
          outlineColor={0xFFFFFF}
          font="/RobotoSlab-Regular.ttf"
          position={new Vector3(0, 2.5  + .05)}>
          Im
        </Text>
      </>
    )
  } else {
    return (
      <>
        <Text
          color={SECONDARY_LINES}
          anchorX="center"
          anchorY="bottom"
          scale={new Vector3(.05, .05, 0)}
          outlineColor={0xFFFFFF}
          font="/RobotoSlab-Regular.ttf"
          position={new Vector3(0, height + .05)}>
          Im
        </Text>
      </>
    )
  }
}

type RealAxisLabelAttributes = {
  width: number
}

function RealAxisLabel({width}:RealAxisLabelAttributes) {
  if(width < 2.5) {
    return (
      <>
        <Text
          color={SECONDARY_LINES}
          anchorX="left"
          anchorY="middle"
          scale={new Vector3(.05, .05, 0)}
          outlineColor={0xFFFFFF}
          font="/RobotoSlab-Regular.ttf"
          position={new Vector3(2.5 + .05, 0)}>
          Re
        </Text>
      </>
    )
  } else {
    return (
      <>
        <Text
          color={SECONDARY_LINES}
          anchorX="left"
          anchorY="middle"
          scale={new Vector3(.05, .05, 0)}
          outlineColor={0xFFFFFF}
          font="/RobotoSlab-Regular.ttf"
          position={new Vector3(width + .05, 0)}>
          Re
        </Text>
      </>
    )
  }
}

type FigureSevenAttributes = {
  s: number[]
}

function FigureSeven({s}:FigureSevenAttributes) {

  const O = new Vector2(0, 0);
  
  const α = Math.atan2(s[1], s[0]);
  const β = α/2;

  const a_ = new Vector2(s[0], 0);
  const A = new Vector2(1, 0);
  const A_prime = new Vector2(-1, 0);

  const a = s[0];
  const b = s[1];
  const c = 1/b;

  const b_ = new Vector2(0, s[1]);
 
  const abs_s = Math.sqrt(a_.x * a_.x + b * b);

  const B_prime = new Vector2(A_prime.x - (c/Math.sin(β)) * Math.sin(Math.PI/2 - β), 0);
  const B = new Vector2(-B_prime.x, 0);

  const abs_B = B.x;
  
  const s_ = new Vector2(s[0], s[1]);
  const S_radius = Math.sqrt(s_.x * s_.x + s_.y * s_.y);
  const S = new Vector2(S_radius, 0); 
  const S_prime = new Vector2(-S.x, 0);

  const c_ = new Vector2(0, c);
  const c__prime = new Vector2(0, -c_.y);
  const C = new Vector2(A_prime.x, c_.y);

  const E = new Vector2(abs_B/abs_s * (a_.x), 0);

  const F = new Vector2(0, (B.x * Math.sin(β)) / Math.sin(Math.PI / 2 - β));
  
  const D = new Vector2(E.x, abs_B * Math.sin(α));

  return (
    <>
      <Point position={O} label="O"></Point>

      <Point position={A} label="A"></Point>
      <Point position={A_prime} label="A'"></Point>

      <Point position={s_} label="s"></Point>
      <Point position={b_} label="b"></Point>
      <Point position={a_} label="a"></Point>

      <Point position={S} label="S"></Point>
      <Point position={S_prime} label="S'"></Point>
      <Segment start={O} end={s_} />
      <Angle origin={O} radius={0.25} angle={α} label="α"/>

      <Point position={c_} label="c"></Point>
      <Point position={c__prime} label="c'"></Point>
      <CircleCurve radius={c} origin={O} start={0}  end={Math.PI  * 2}/>

      <Point position={C} label="C"></Point>
      <Segment start={C} end={c_}/>
      <Segment start={C} end={A_prime}/>

      <Point position={D} label="D"></Point>
      <Point position={E} label="E"></Point>
      <Segment start={D} end={E}/>
      <Segment start={D} end={B_prime}/>
      <Angle origin={B_prime} radius={0.25} angle={β} label="β"/>
      <Segment start={D} end={B}/>

      
      <Point position={F} label="F"></Point> 

      <Point position={B} label="B"></Point>
      <Point position={B_prime} label="B'"></Point>
      <CircleCurve radius={abs_B} origin={O} start={0}  end={Math.PI}/>


      <Segment start={O} end={S}/>
      <Segment start={O} end={S_prime}/>
      <Segment start={O} end={B}/>
      <Segment start={O} end={B_prime}/>
      <Segment start={O} end={new Vector2(0, S.x)}/>
      <Segment start={O} end={new Vector2(0, B.x)}/>

      <RealAxisLabel width={S.x}/>
      <ImaginaryAxisLabel height={S.y}/>

    </>
  );
}

export default function Home() {

  const {s} = useControls({
    s: {
      value: [1.2256550281188, 2.2499254761146],
      label: "s",
      step: 0.01
    }
  });

  return (
    <>
      <Head>
        <title>Figure Seven</title>
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
            <FigureSeven s={s}/>

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
