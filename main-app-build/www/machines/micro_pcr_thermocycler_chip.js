import { glass, gold, copper, aluminum } from '../utils/materials.js';

export function createPCRThermocycler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chip base
    const baseGeom = new THREE.BoxGeometry(10, 0.3, 15);
    const base = new THREE.Mesh(baseGeom, glass);
    group.add(base);

    // Heating zones (copper pads)
    const heaterGeom = new THREE.PlaneGeometry(8, 3);
    const heater1 = new THREE.Mesh(heaterGeom, copper);
    heater1.rotation.x = -Math.PI / 2;
    heater1.position.set(0, 0.16, -5);
    group.add(heater1);

    const heater2 = new THREE.Mesh(heaterGeom, aluminum); // Denaturation
    heater2.rotation.x = -Math.PI / 2;
    heater2.position.set(0, 0.16, 0);
    group.add(heater2);

    const heater3 = new THREE.Mesh(heaterGeom, gold); // Annealing
    heater3.rotation.x = -Math.PI / 2;
    heater3.position.set(0, 0.16, 5);
    group.add(heater3);

    // Serpentine Channel
    const channelMat = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    const points = [];
    for(let z = -6; z <= 6; z += 0.5) {
        points.push(new THREE.Vector3(-3, 0.2, z));
        points.push(new THREE.Vector3(3, 0.2, z));
        points.push(new THREE.Vector3(3, 0.2, z + 0.25));
        points.push(new THREE.Vector3(-3, 0.2, z + 0.25));
    }
    const channelGeom = new THREE.BufferGeometry().setFromPoints(points);
    const channel = new THREE.Line(channelGeom, channelMat);
    group.add(channel);

    // Fluid element animating through channel
    const fluidGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const fluidMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const fluid = new THREE.Mesh(fluidGeom, fluidMat);
    fluid.name = "fluid_plug";
    group.add(fluid);

    // Create animation track along points
    const times = [];
    const values = [];
    points.forEach((p, i) => {
        times.push(i * 0.1);
        values.push(p.x, p.y, p.z);
    });

    const track = new THREE.VectorKeyframeTrack(`${fluid.name}.position`, times, values);
    // Color change track depending on z position
    const colorTimes = [];
    const colorValues = [];
    points.forEach((p, i) => {
        colorTimes.push(i * 0.1);
        if (p.z < -2) colorValues.push(1, 0, 0); // Red (Hot)
        else if (p.z < 2) colorValues.push(0, 1, 0); // Green (Medium)
        else colorValues.push(0, 0, 1); // Blue (Cool)
    });
    const colorTrack = new THREE.ColorKeyframeTrack(`${fluid.name}.material.color`, colorTimes, colorValues);

    const clip = new THREE.AnimationClip('PCR_Cycle', times[times.length-1], [track, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
