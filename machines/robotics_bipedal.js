import * as THREE from 'three';
import { whitePlastic, steel, carbonFiber, titanium, rubber } from '../utils/materials.js';

export function createBipedalWalkingMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 0.6), whitePlastic);
    pelvis.position.y = 2.4;
    pelvis.name = 'Pelvis';
    group.add(pelvis);

    function createLeg(namePrefix, xOffset) {
        const legGroup = new THREE.Group();
        legGroup.position.set(xOffset, 2.4, 0);
        legGroup.name = `${namePrefix}Leg`;
        group.add(legGroup);

        legGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), steel));

        const thighGroup = new THREE.Group();
        thighGroup.name = `${namePrefix}Thigh`;
        legGroup.add(thighGroup);

        const thighGeo = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
        thighGeo.translate(0, -0.5, 0);
        thighGroup.add(new THREE.Mesh(thighGeo, carbonFiber));

        const kneeGroup = new THREE.Group();
        kneeGroup.position.set(0, -1.0, 0);
        kneeGroup.name = `${namePrefix}Knee`;
        thighGroup.add(kneeGroup);

        kneeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.35, 16).rotateZ(Math.PI/2), steel));

        const calfGeo = new THREE.CylinderGeometry(0.12, 0.08, 1.0, 16);
        calfGeo.translate(0, -0.5, 0);
        kneeGroup.add(new THREE.Mesh(calfGeo, titanium));

        const ankleGroup = new THREE.Group();
        ankleGroup.position.set(0, -1.0, 0);
        ankleGroup.name = `${namePrefix}Ankle`;
        kneeGroup.add(ankleGroup);

        const footGeo = new THREE.BoxGeometry(0.3, 0.15, 0.6);
        footGeo.translate(0, -0.075, 0.15);
        ankleGroup.add(new THREE.Mesh(footGeo, rubber));

        return legGroup;
    }

    createLeg('Left', -0.35);
    createLeg('Right', 0.35);

    const times = [0, 0.5, 1.0, 1.5, 2.0];
    const tracks = [
        new THREE.NumberKeyframeTrack('Pelvis.position[y]', times, [2.4, 2.45, 2.4, 2.45, 2.4]),
        new THREE.NumberKeyframeTrack('LeftThigh.rotation[x]', times, [0, Math.PI/6, 0, -Math.PI/6, 0]),
        new THREE.NumberKeyframeTrack('LeftKnee.rotation[x]', times, [0, 0, Math.PI/4, 0, 0]),
        new THREE.NumberKeyframeTrack('LeftAnkle.rotation[x]', times, [0, -Math.PI/12, 0, Math.PI/12, 0]),
        new THREE.NumberKeyframeTrack('RightThigh.rotation[x]', times, [0, -Math.PI/6, 0, Math.PI/6, 0]),
        new THREE.NumberKeyframeTrack('RightKnee.rotation[x]', times, [Math.PI/4, 0, 0, 0, Math.PI/4]),
        new THREE.NumberKeyframeTrack('RightAnkle.rotation[x]', times, [0, Math.PI/12, 0, -Math.PI/12, 0])
    ];

    const clip = new THREE.AnimationClip('Walking_Cycle', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
