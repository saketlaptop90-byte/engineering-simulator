import * as THREE from 'three';
import { castIron, orangeAccent, darkSteel, chrome, aluminum, fire } from '../utils/materials.js';

export function createRoboticWeldingCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const table = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 2), castIron);
    table.position.set(0, 0.4, 0);
    group.add(table);

    const piece = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), aluminum);
    piece.position.set(0.5, 0.9, 0);
    group.add(piece);

    const robotGroup = new THREE.Group();
    robotGroup.position.set(-0.8, 0.8, 0);
    group.add(robotGroup);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.3, 32), darkSteel);
    base.position.y = 0.15;
    robotGroup.add(base);

    const axis1Group = new THREE.Group();
    axis1Group.name = 'Axis1';
    axis1Group.position.y = 0.3;
    robotGroup.add(axis1Group);
    
    const link1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.4, 32), orangeAccent);
    link1.position.y = 0.2;
    axis1Group.add(link1);

    const axis2Group = new THREE.Group();
    axis2Group.name = 'Axis2';
    axis2Group.position.y = 0.4;
    axis1Group.add(axis2Group);
    
    axis2Group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32).rotateZ(Math.PI/2), darkSteel));
    axis2Group.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3).translate(0, 0.6, 0), orangeAccent));

    const axis3Group = new THREE.Group();
    axis3Group.name = 'Axis3';
    axis3Group.position.y = 1.2;
    axis2Group.add(axis3Group);

    axis3Group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32).rotateZ(Math.PI/2), darkSteel));
    axis3Group.add(new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.25).translate(0, 0.5, 0), orangeAccent));

    const wristGroup = new THREE.Group();
    wristGroup.name = 'Wrist';
    wristGroup.position.y = 1.0;
    axis3Group.add(wristGroup);

    const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.4, 16).translate(0, 0.2, 0), chrome);
    torch.rotation.x = Math.PI / 2;
    wristGroup.add(torch);

    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), fire);
    spark.position.set(0, 0, 0.4);
    spark.name = 'Spark';
    wristGroup.add(spark);

    const times = [0, 1, 2, 3, 4, 5, 6];
    const tracks = [
        new THREE.NumberKeyframeTrack('Axis1.rotation[y]', times, [0, -Math.PI/4, -Math.PI/4, -Math.PI/6, -Math.PI/6, 0, 0]),
        new THREE.NumberKeyframeTrack('Axis2.rotation[z]', times, [0, Math.PI/6, Math.PI/4, Math.PI/4, Math.PI/6, 0, 0]),
        new THREE.NumberKeyframeTrack('Axis3.rotation[z]', times, [0, Math.PI/4, Math.PI/3, Math.PI/2.5, Math.PI/3, 0, 0]),
        new THREE.NumberKeyframeTrack('Wrist.rotation[x]', times, [0, -Math.PI/4, -Math.PI/2, -Math.PI/2, -Math.PI/4, 0, 0]),
        new THREE.VectorKeyframeTrack('Spark.scale', [0, 1, 2.1, 2.5, 2.9, 4, 6], [
            0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 1, 1, 0.5, 0.5, 0.5, 1.2, 1.2, 1.2, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01
        ])
    ];

    const clip = new THREE.AnimationClip('Welding_Motion', 6, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
