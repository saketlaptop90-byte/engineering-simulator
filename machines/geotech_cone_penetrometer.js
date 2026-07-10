import * as mats from '../utils/materials.js';

export function createConePenetrometer(THREE) {
    const group = new THREE.Group();
    group.name = 'ConePenetrometer';
    
    // Truck / Rig base
    const baseGeo = new THREE.BoxGeometry(4, 1, 6);
    const base = new THREE.Mesh(baseGeo, mats.blueAccent);
    base.position.y = 0.5;
    group.add(base);

    // Hydraulic Cylinders (Static Outer)
    const cylGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const cyl1 = new THREE.Mesh(cylGeo, mats.yellowAccent);
    cyl1.position.set(-0.5, 2.5, 0);
    group.add(cyl1);

    const cyl2 = new THREE.Mesh(cylGeo, mats.yellowAccent);
    cyl2.position.set(0.5, 2.5, 0);
    group.add(cyl2);

    // Press block (Moves down)
    const pressGeo = new THREE.BoxGeometry(1.5, 0.4, 0.8);
    const press = new THREE.Mesh(pressGeo, mats.steel);
    press.position.set(0, 3.8, 0);
    press.name = 'PressBlock';
    group.add(press);

    // CPT Cone Rod
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 16);
    const rod = new THREE.Mesh(rodGeo, mats.chrome);
    rod.position.set(0, 1.5, 0);
    rod.name = 'CPTRod';
    group.add(rod);
    
    const coneGeo = new THREE.ConeGeometry(0.12, 0.3, 16);
    coneGeo.rotateX(Math.PI); // Point down
    const cone = new THREE.Mesh(coneGeo, mats.titanium);
    cone.position.set(0, -2.15, 0); // attached to rod end
    rod.add(cone);

    // Animation: Press block and rod push down together
    const times = [0, 3, 4, 5];
    const pressValues = [
        0, 3.8, 0,
        0, 1.2, 0,
        0, 1.2, 0,
        0, 3.8, 0
    ];
    const rodValues = [
        0, 1.5, 0,
        0, -1.1, 0,
        0, -1.1, 0,
        0, 1.5, 0
    ];

    const pressTrack = new THREE.VectorKeyframeTrack('PressBlock.position', times, pressValues);
    const rodTrack = new THREE.VectorKeyframeTrack('CPTRod.position', times, rodValues);

    const clip = new THREE.AnimationClip('PushCone', 5.0, [pressTrack, rodTrack]);

    return { group, animationClips: [clip] };
}
