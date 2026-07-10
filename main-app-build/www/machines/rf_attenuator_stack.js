import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createRFAttenuatorStack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const stackHeight = 5;
    const spacing = 1.2;

    for(let i=0; i<stackHeight; i++) {
        // Attenuator body
        const attGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
        const att = new THREE.Mesh(attGeom, darkSteel);
        att.position.y = i * spacing;
        group.add(att);

        // Connectors
        const connGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
        const conn = new THREE.Mesh(connGeom, gold);
        conn.position.y = i * spacing;
        group.add(conn);

        // Cooling fins
        const finGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);
        for(let j=-0.3; j<=0.3; j+=0.15) {
            const fin = new THREE.Mesh(finGeom, aluminum);
            fin.position.y = i * spacing + j;
            group.add(fin);
        }
    }

    // Main line
    const lineGeom = new THREE.CylinderGeometry(0.05, 0.05, stackHeight * spacing, 8);
    const line = new THREE.Mesh(lineGeom, copper);
    line.position.y = (stackHeight - 1) * spacing / 2;
    line.position.x = 0.5;
    group.add(line);

    // Animation: Signal descending through stack
    const trackName = line.uuid + '.position[y]';
    const times = [0, 1, 2];
    const values = [line.position.y, line.position.y - 0.2, line.position.y];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Attenuate_Signal', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
