import { steel, castIron, aluminum, orangeAccent, redAccent } from '../utils/materials.js';

export function createExtrusionDieHead(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1.2, 3, 32);
    const body = new THREE.Mesh(bodyGeo, steel);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Heater Bands
    const bandGeo = new THREE.TorusGeometry(1.25, 0.1, 16, 32);
    for (let i = -1; i <= 1; i++) {
        const band = new THREE.Mesh(bandGeo, orangeAccent);
        band.position.x = i;
        band.rotation.y = Math.PI / 2;
        group.add(band);
    }

    // Die Plate
    const dieGeo = new THREE.CylinderGeometry(0.5, 1, 0.5, 32);
    const die = new THREE.Mesh(dieGeo, aluminum);
    die.position.x = 1.75;
    die.rotation.z = Math.PI / 2;
    group.add(die);

    // Extrudate (Plastic material coming out)
    const extrudateGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 16);
    const extrudate = new THREE.Mesh(extrudateGeo, redAccent);
    extrudate.position.x = 4.5;
    extrudate.rotation.z = Math.PI / 2;
    group.add(extrudate);

    // Animation: Extrudate scaling and translating to simulate flow
    const times = [0, 2];
    const scaleValues = [
        0.01, 1, 1,
        1, 1, 1
    ];
    const posValues = [
        2, 0, 0,
        4.5, 0, 0
    ];
    
    extrudate.name = "Extrudate";
    const scaleTrack = new THREE.VectorKeyframeTrack(extrudate.name + '.scale', times, scaleValues);
    const posTrack = new THREE.VectorKeyframeTrack(extrudate.name + '.position', times, posValues);
    
    const clip = new THREE.AnimationClip('Extrude', 2, [scaleTrack, posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
