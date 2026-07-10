import { getMaterials } from '../utils/materials.js';

export function createTelescopeEquatorialMount(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    
    // Pier / Base
    const pierGeo = new THREE.CylinderGeometry(1.5, 2, 5, 32);
    const pier = new THREE.Mesh(pierGeo, materials.metal);
    pier.position.y = 2.5;
    group.add(pier);

    // Equatorial Head Base
    const headBaseGeo = new THREE.BoxGeometry(2, 2, 2);
    const headBase = new THREE.Mesh(headBaseGeo, materials.plastic);
    headBase.position.y = 5.5;
    // Set latitude angle (e.g., 45 degrees)
    headBase.rotation.x = Math.PI / 4;
    group.add(headBase);

    // Polar Axis (Right Ascension)
    const raAxisGroup = new THREE.Group();
    raAxisGroup.position.set(0, 5.5, 0);
    raAxisGroup.rotation.x = Math.PI / 4;
    raAxisGroup.name = "raAxis";
    group.add(raAxisGroup);

    const raHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 32), materials.metal);
    raHousing.rotation.x = Math.PI / 2;
    raAxisGroup.add(raHousing);

    // Declination Axis
    const decAxisGroup = new THREE.Group();
    decAxisGroup.position.set(0, 0, -1.5);
    decAxisGroup.name = "decAxis";
    raAxisGroup.add(decAxisGroup);

    const decHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 32), materials.metal);
    decHousing.rotation.z = Math.PI / 2;
    decAxisGroup.add(decHousing);

    // Counterweights
    const counterWeightShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), materials.chrome);
    counterWeightShaft.position.x = 2.5;
    counterWeightShaft.rotation.z = Math.PI / 2;
    decAxisGroup.add(counterWeightShaft);

    const weightGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const weight1 = new THREE.Mesh(weightGeo, materials.plastic);
    weight1.position.x = 3;
    weight1.rotation.z = Math.PI / 2;
    decAxisGroup.add(weight1);

    const weight2 = new THREE.Mesh(weightGeo, materials.plastic);
    weight2.position.x = 3.6;
    weight2.rotation.z = Math.PI / 2;
    decAxisGroup.add(weight2);

    // Telescope Tube
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const tube = new THREE.Mesh(tubeGeo, materials.plastic);
    tube.position.x = -2.5;
    tube.rotation.x = Math.PI / 2;
    decAxisGroup.add(tube);

    // Lens / Mirror (simple representation)
    const lensGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
    const lens = new THREE.Mesh(lensGeo, materials.glass);
    lens.position.y = 3.9;
    tube.add(lens);

    // Animation: Tracking motion
    const times = [0, 5, 10];
    const raValues = [0, Math.PI / 2, Math.PI]; // Rotating slowly on RA axis
    const raTrack = new THREE.NumberKeyframeTrack(`${raAxisGroup.name}.rotation[z]`, times, raValues);

    const decTimes = [0, 2.5, 5, 7.5, 10];
    const decValues = [0, Math.PI / 8, 0, -Math.PI / 8, 0]; // Slight declination adjustments
    const decTrack = new THREE.NumberKeyframeTrack(`${decAxisGroup.name}.rotation[x]`, decTimes, decValues);

    const clip = new THREE.AnimationClip('TelescopeTracking', 10, [raTrack, decTrack]);

    return { group, animationClips: [clip] };
}
