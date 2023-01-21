import Head from 'next/head'

import { Canvas, ReactThreeFiber, extend } from "@react-three/fiber";
import { MapControls, Text } from '@react-three/drei';

import styles from '../styles/figure-five.module.css'
import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Vector3 } from 'three';
import {Leva, useControls} from 'leva';

extend({ Line_: Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

const LABEL_LINES = 0x888888;
const PRIMARY_LINES = 0x000000;

function RealAxis() {
  const points = [];
  points.push( new Vector3( -2.5, 0, 0 ) );
  points.push( new Vector3( 2.5, 0, 0 ) );
  
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: 0x555555 });

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
  const material = new LineBasicMaterial({ color: 0x555555 });

  return (
    <>
      <line_ geometry={geometry} material={material} />
    </>
  );
}

function UnitCircle() {
  const curve = new EllipseCurve(
    0,
    0,
    1,
    1,
    0,
    1 * Math.PI,
    false,
    0
  );

  const points = curve.getPoints(50);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: PRIMARY_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
    </>
  );
}

type PhiAttributes = {
  φ: number // Radians,
  radius: number,
};

function Phi(attributes:PhiAttributes) {
  const {φ, radius} = attributes;

  const points = [];
  points.push(new Vector3(0, 0, 0));

  const x = radius * Math.cos(φ);
  const y = radius * Math.sin(φ);

  points.push(new Vector3(x, y, 0));

  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: 0x555555 });

  const arc = new EllipseCurve(
    0,
    0,
    radius,
    radius,
    0,
    φ,
    false,
    0
  );

  const arcPoints = arc.getPoints(50);
  const arcGeometry = new BufferGeometry().setFromPoints(arcPoints);
  const arcMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  // COS PHI
  const cosPhiPoints = [];
  cosPhiPoints.push(new Vector3(Math.cos(φ), -.618, 0));
  cosPhiPoints.push(new Vector3(Math.cos(φ), Math.sin(φ), 0));

  const cosPhiGeometry = new BufferGeometry().setFromPoints(cosPhiPoints);
  const cosPhiMaterial = new LineBasicMaterial({ color: 0x555555 });

  // COS PHI Label
  const cosPhiLabelPoints = [];
  cosPhiLabelPoints.push(new Vector3(0, -.618, 0));
  cosPhiLabelPoints.push(new Vector3(Math.cos(φ), -.618, 0));

  const cosPhiLabelGeometry = new BufferGeometry().setFromPoints(cosPhiLabelPoints);
  const cosPhiLabelMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  // SIN PHI
  const sinPhiPoints = [];
  sinPhiPoints.push(new Vector3(Math.cos(φ), Math.sin(φ), 0));
  sinPhiPoints.push(new Vector3(1.618, Math.sin(φ), 0));

  const sinPhiGeometry = new BufferGeometry().setFromPoints(sinPhiPoints);
  const sinPhiMaterial = new LineBasicMaterial({ color: 0x555555 });

  // SIN PHI Label
  const sinPhiLabelPoints = [];
  sinPhiLabelPoints.push(new Vector3(1.618, Math.sin(φ), 0));
  sinPhiLabelPoints.push(new Vector3(1.618, 0, 0));

  const sinPhiLabelGeometry = new BufferGeometry().setFromPoints(sinPhiLabelPoints);
  const sinPhiLabelMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  // Relationship A
  const reltionshipA = new EllipseCurve(
    Math.cos(φ),
    Math.sin(φ),
    .618,
    .618,
    0 - Math.PI/2,
    φ/2 - Math.PI/2,
    false,
    0
  );

  const reltionshipALabelPoints = reltionshipA.getPoints(50);
  const reltionshipALabelGeometry = new BufferGeometry().setFromPoints(reltionshipALabelPoints);
  const reltionshipALabelMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  // Relationship B
  const reltionshipB = new EllipseCurve(
    -1,
    0,
    .618,
    .618,
    0,
    φ/2,
    false,
    0
  );

  const reltionshipBLabelPoints = reltionshipB.getPoints(50);
  const reltionshipBLabelGeometry = new BufferGeometry().setFromPoints(reltionshipBLabelPoints);
  const reltionshipBLabelMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
      <line_ geometry={arcGeometry} material={arcMaterial} />
      <line_ geometry={cosPhiGeometry} material={cosPhiMaterial} />
      <line_ geometry={cosPhiLabelGeometry} material={cosPhiLabelMaterial} />
      <line_ geometry={sinPhiGeometry} material={sinPhiMaterial} />
      <line_ geometry={sinPhiLabelGeometry} material={sinPhiLabelMaterial} />
      <line_ geometry={reltionshipALabelGeometry} material={reltionshipALabelMaterial} />
      <line_ geometry={reltionshipBLabelGeometry} material={reltionshipBLabelMaterial} />
    </>
  );
}

type InnerAnglesAttributes = {
  φ: number // Radians,
};

function InnerAngles(attributes:InnerAnglesAttributes) {
  const {φ} = attributes;

  // PHI
  const phiPoints = [];
  phiPoints.push(new Vector3(0, 0, 0));
  phiPoints.push(new Vector3(Math.cos(φ), Math.sin(φ), 0));

  const phiGeometry = new BufferGeometry().setFromPoints(phiPoints);
  const phiMaterial = new LineBasicMaterial({ color: PRIMARY_LINES });

  // COS PHI
  const cosPhiPoints = [];
  cosPhiPoints.push(new Vector3(Math.cos(φ), 0, 0));
  cosPhiPoints.push(new Vector3(Math.cos(φ), Math.sin(φ), 0));

  const cosPhiGeometry = new BufferGeometry().setFromPoints(cosPhiPoints);
  const cosPhiMaterial = new LineBasicMaterial({ color: PRIMARY_LINES });

  // Triangle
  const trianglePoints = [];
  trianglePoints.push(new Vector3(-1, 0, 0));
  trianglePoints.push(new Vector3(Math.cos(φ), Math.sin(φ), 0));
  trianglePoints.push(new Vector3(1, 0, 0));
  trianglePoints.push(new Vector3(-1, 0, 0));

  const triangleGeometry = new BufferGeometry().setFromPoints(trianglePoints);
  const triangleMaterial = new LineBasicMaterial({ color: PRIMARY_LINES });

  return (
    <>
      <line_ geometry={phiGeometry} material={phiMaterial} />
      <line_ geometry={cosPhiGeometry} material={cosPhiMaterial} />
      <line_ geometry={triangleGeometry} material={triangleMaterial} />
    </>
  );
}

type UAttributes = {
  φ: number // Radians
}

function U(attributes:UAttributes) {
  const {φ} = attributes;
  const u = Math.tan(φ/2);

  const points = [];
  points.push(new Vector3(-.618, u, 0));
  points.push(new Vector3(0, u, 0));

  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: PRIMARY_LINES });
  
  const labelPoints = [];
  labelPoints.push(new Vector3(-.618, u, 0));
  labelPoints.push(new Vector3(-.618, 0, 0));

  const labelGeometry = new BufferGeometry().setFromPoints(labelPoints);
  const labelMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  const angle = (φ/2) + (Math.PI/2);

  const sqrtPoints = [];
  sqrtPoints.push(new Vector3(0 + 1 * Math.cos(angle), u + 1 * Math.sin(angle), 0));
  sqrtPoints.push(new Vector3(-1 + (1 * Math.cos(angle)), 1 * Math.sin(angle) , 0));

  const sqrtGeometry = new BufferGeometry().setFromPoints(sqrtPoints);
  const sqrtMaterial = new LineBasicMaterial({ color: LABEL_LINES });

  const sqrtPointsA = [];
  sqrtPointsA.push(new Vector3(0, u, 0));
  sqrtPointsA.push(new Vector3(0 + 1 * Math.cos(angle), u + 1 * Math.sin(angle), 0));

  const sqrtGeometryA = new BufferGeometry().setFromPoints(sqrtPointsA);
  const sqrtMaterialA = new LineBasicMaterial({ color: 0x555555 });

  const sqrtPointsB = [];
  sqrtPointsB.push(new Vector3(-1, 0, 0));
  sqrtPointsB.push(new Vector3(-1 + (1 * Math.cos(angle)), 1 * Math.sin(angle), 0));

  const sqrtGeometryB = new BufferGeometry().setFromPoints(sqrtPointsB);
  const sqrtMaterialB = new LineBasicMaterial({ color: 0x555555 });

  const yAxisPoints = [];
  yAxisPoints.push(new Vector3(0, 0, 0));
  yAxisPoints.push(new Vector3(0, u, 0));

  const yAxisGeometry = new BufferGeometry().setFromPoints(yAxisPoints);
  const yAxisMaterial = new LineBasicMaterial({ color: PRIMARY_LINES });

  return (
    <>
      <line_ geometry={geometry} material={material} />
      <line_ geometry={labelGeometry} material={labelMaterial} />
      <line_ geometry={sqrtGeometryA} material={sqrtMaterialA} />
      <line_ geometry={sqrtGeometryB} material={sqrtMaterialB} />
      <line_ geometry={sqrtGeometry} material={sqrtMaterial} />
      <line_ geometry={yAxisGeometry} material={yAxisMaterial} />
    </>
  );
}

type LabelsAttributes = {
  φ: number // Radians
}

function Labels(attributes:LabelsAttributes) {
  const {φ} = attributes;
  const u = Math.tan(φ/2);
  const angle = (φ/2) + (Math.PI/2);
  const sqrtX = (Math.cos(angle) + (-1 + Math.cos(angle))) / 2;
  const sqrtY = ((u + Math.sin(angle)) + Math.sin(angle)) / 2;

  return (
    <>
      <Text
        color={0x555555}
        anchorX="center"
        anchorY="bottom"
        scale={new Vector3(.075, .075, 0)}
        position={new Vector3(0, 2.5, 0)}>
        Im
      </Text>

      <Text
        color={0x555555}
        anchorX="left"
        anchorY="middle"
        scale={new Vector3(.075, .075, 0)}
        position={new Vector3(2.51, 0, 0)}>
        Re
      </Text>

      <Text
        color={0x555555}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.1, .1, 0)}
        outlineColor={0xFFFFFF}
        position={new Vector3(1.618, Math.sin(φ)/2, 0)}>
        sin( phi )
      </Text>

      <Text
        color={0x555555}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.1, .1, 0)}
        outlineColor={0xFFFFFF}
        position={new Vector3(Math.cos(φ)/2, -.618, 0)}>
        cos( phi )
      </Text>

      <Text
        color={0x555555}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.1, .1, 0)}
        outlineColor={0xFFFFFF}
        position={new Vector3(sqrtX, sqrtY, 0)}>
        sqrt( 1 + u^2 )
      </Text>

      <Text
        color={0x555555}
        anchorX="center"
        anchorY="middle"
        scale={new Vector3(.1, .1, 0)}
        outlineColor={0xFFFFFF}
        position={new Vector3(-.618, u/2, 0)}>
        u
      </Text>
    </>
  );
}

function FigureFive({}) {

  // const earthDiv = document.createElement("div");
  // earthDiv.className = "label";
  // earthDiv.textContent = "Earth";
  // earthDiv.style.marginTop = "-1em";
  // const earthLabel = new CSS2DObject(earthDiv);
  // earthLabel.position.set(0, 2, 0);
  // earth.add(earthLabel);

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
      <Phi φ={φ} radius={2}></Phi>
      <U φ={φ}></U>
      <InnerAngles φ={φ}/>
      <UnitCircle></UnitCircle>
      <Labels φ={φ}></Labels>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Figure 5</title>
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
            <FigureFive></FigureFive>

            {/* TODO: Add labels: see: https://codesandbox.io/s/three-js-css2d-labels-ghrn4?file=/src/index.js */}
            {/* TODO: Limit zoom. see: https://stackoverflow.com/questions/69607783/how-to-limit-panning-distance-in-react-three-fiber-mapcontrols */}
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
