import { glass, titanium, gold } from '../utils/materials.js';

export function createIonTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chamber
    const chamberGeo = new THREE.CylinderGeometry(5, 5, 10, 32);
    const chamber = new THREE.Mesh(chamberGeo, glass);
    group.add(chamber);

    // Electrodes
    const electrodeGeo = new THREE.BoxGeometry(0.5, 8, 0.5);
    const electrodes = [
        new THREE.Mesh(electrodeGeo, gold),
        new THREE.Mesh(electrodeGeo, gold),
        new THREE.Mesh(electrodeGeo, gold),
        new THREE.Mesh(electrodeGeo, gold)
    ];
    electrodes[0].position.set(2, 0, 2);
    electrodes[1].position.set(-2, 0, 2);
    electrodes[2].position.set(2, 0, -2);
    electrodes[3].position.set(-2, 0, -2);
    electrodes.forEach(e => group.add(e));

    // Base
    const baseGeo = new THREE.CylinderGeometry(6, 6, 1, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    base.position.y = -5.5;
    group.add(base);

    // Ions
    const ionGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const ionMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const ions = [];
    for (let i = 0; i < 5; i++) {
        const ion = new THREE.Mesh(ionGeo, ionMat);
        ion.position.set(0, -2 + i * 1, 0);
        ions.push(ion);
        group.add(ion);
    }

    // Laser beam
    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.rotation.z = Math.PI / 2;
    group.add(laser);

    // Animation: Ions levitating
    const times = [0, 1, 2];
    ions.forEach((ion, index) => {
        const values = [
            0, ion.position.y, 0,
            0, ion.position.y + 0.5, 0,
            0, ion.position.y, 0
        ];
        const trackName = `${ion.uuid}.position`;
        const track = new THREE.VectorKeyframeTrack(trackName, times, values);
        const clip = new THREE.AnimationClip(`Levitate_Ion_${index}`, 2, [track]);
        animationClips.push(clip);
    });

    // Animation: Laser pulsing
    const opacityTimes = [0, 0.5, 1];
    const opacityValues = [0, 0.8, 0];
    const laserTrack = new THREE.NumberKeyframeTrack(`${laserMat.uuid}.opacity`, opacityTimes, opacityValues);
    const laserClip = new THREE.AnimationClip('Pulse_Laser', 1, [laserTrack]);
    animationClips.push(laserClip);

    return { group, animationClips };
}
