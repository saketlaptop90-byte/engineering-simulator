import { aluminum, titanium, glass, gold } from '../utils/materials.js';

export function createCupolaModule(THREE) {
    const group = new THREE.Group();
    group.name = 'CupolaObservationModule';

    // Body (Hexagonal or spherical base)
    const bodyGeometry = new THREE.CylinderGeometry(2, 2.5, 2, 8);
    const body = new THREE.Mesh(bodyGeometry, aluminum);
    group.add(body);

    // Windows (Dome with windows)
    const domeGeometry = new THREE.SphereGeometry(2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeometry, glass);
    dome.position.y = 1;
    group.add(dome);

    // Shutters (Animate opening and closing)
    const shutters = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const shutterGeo = new THREE.BoxGeometry(1.5, 1.5, 0.1);
        const shutter = new THREE.Mesh(shutterGeo, titanium);
        
        // Position in a hexagon shape
        const angle = i * Math.PI / 3;
        shutter.position.set(Math.cos(angle) * 2.3, 1.5, Math.sin(angle) * 2.3);
        shutter.lookAt(0, 1.5, 0);
        shutter.name = `shutter_${i}`;
        shutters.add(shutter);
    }
    group.add(shutters);

    // Animations: Shutters opening
    const animationClips = [];
    const tracks = [];
    for (let i = 0; i < 6; i++) {
        const trackName = `shutter_${i}.position`;
        const initialPos = shutters.children[i].position;
        // Shutters move upwards to reveal the windows
        const times = [0, 2, 4];
        const values = [
            initialPos.x, initialPos.y, initialPos.z,
            initialPos.x, initialPos.y + 1, initialPos.z,
            initialPos.x, initialPos.y, initialPos.z
        ];
        tracks.push(new THREE.VectorKeyframeTrack(trackName, times, values));
    }
    const clip = new THREE.AnimationClip('ShuttersCycle', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
