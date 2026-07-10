import * as materials from '../utils/materials.js';

export function createKnittingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metal || new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8});
    const matNeedle = materials.lightMetal || new THREE.MeshStandardMaterial({color: 0xcccccc});
    const matYarn = materials.yarn || new THREE.MeshStandardMaterial({color: 0xff0055});

    const baseGeo = new THREE.CylinderGeometry(2, 2, 1, 64);
    const base = new THREE.Mesh(baseGeo, matMetal);
    base.position.set(0, 0.5, 0);
    group.add(base);

    const cylinderGeo = new THREE.CylinderGeometry(1.8, 1.8, 2, 64);
    const cylinder = new THREE.Mesh(cylinderGeo, matMetal);
    cylinder.position.set(0, 2, 0);
    group.add(cylinder);

    const creel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), matMetal);
    creel.position.set(0, 4, 0);
    group.add(creel);
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), matYarn);
        cone.position.set(Math.cos(angle)*0.5, 4, Math.sin(angle)*0.5);
        cone.rotation.x = Math.PI;
        group.add(cone);
    }

    const tracks = [];
    const numNeedles = 36;
    for (let i = 0; i < numNeedles; i++) {
        const angle = (i / numNeedles) * Math.PI * 2;
        const needle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), matNeedle);
        
        const x = Math.cos(angle) * 1.85;
        const z = Math.sin(angle) * 1.85;
        
        needle.position.set(x, 2, z);
        needle.rotation.y = -angle;
        group.add(needle);

        const times = [];
        const values = [];
        const steps = 10;
        for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            times.push(t * 2);
            const wave = Math.sin(t * Math.PI * 2 + angle * 4) * 0.3;
            values.push(2 + wave);
        }
        tracks.push(new THREE.NumberKeyframeTrack(`${needle.uuid}.position[y]`, times, values));
    }

    const guideGeo = new THREE.TorusGeometry(1.9, 0.02, 8, 64);
    const guide = new THREE.Mesh(guideGeo, matYarn);
    guide.rotation.x = Math.PI / 2;
    guide.position.set(0, 2.5, 0);
    group.add(guide);

    const cylTimes = [0, 2];
    const cylValues = [0, Math.PI * 2];
    tracks.push(new THREE.NumberKeyframeTrack(`${cylinder.uuid}.rotation[y]`, cylTimes, cylValues));

    const clip = new THREE.AnimationClip('KnittingOperation', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
