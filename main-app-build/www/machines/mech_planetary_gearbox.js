import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createPlanetaryGearbox(THREE) {
    const group = new THREE.Group();
    group.name = "PlanetaryGearbox";

    const sun = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 24), brass);
    sun.name = "SunGear";
    group.add(sun);

    const carrier = new THREE.Group();
    carrier.name = "Carrier";
    group.add(carrier);

    const planetCount = 4;
    const distance = 1.6;
    for(let i=0; i<planetCount; i++) {
        const planet = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16), aluminum);
        const angle = (i / planetCount) * Math.PI * 2;
        planet.position.set(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
        planet.name = `Planet_${i}`;
        carrier.add(planet);
    }

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.3, 16, 48), darkSteel);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const duration = 4;
    const tracks = [];
    
    const steps = 32;
    const times = [];
    const sunVals = [], carrierVals = [];
    const planetVals = Array(planetCount).fill().map(()=>[]);

    for(let i=0; i<=steps; i++) {
        const t = (i/steps);
        times.push(t * duration);

        const sunQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), t * Math.PI * 2 * 4);
        sunVals.push(sunQ.x, sunQ.y, sunQ.z, sunQ.w);

        const carQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), t * Math.PI * 2 * 1);
        carrierVals.push(carQ.x, carQ.y, carQ.z, carQ.w);

        for(let p=0; p<planetCount; p++) {
            const planQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), t * Math.PI * 2 * -4);
            planetVals[p].push(planQ.x, planQ.y, planQ.z, planQ.w);
        }
    }

    tracks.push(new THREE.QuaternionKeyframeTrack('SunGear.quaternion', times, sunVals));
    tracks.push(new THREE.QuaternionKeyframeTrack('Carrier.quaternion', times, carrierVals));
    for(let p=0; p<planetCount; p++) {
        tracks.push(new THREE.QuaternionKeyframeTrack(`Planet_${p}.quaternion`, times, planetVals[p]));
    }

    const clip = new THREE.AnimationClip("GearAction", duration, tracks);
    return { group, animationClips: [clip] };
}
