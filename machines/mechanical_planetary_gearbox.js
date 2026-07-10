import { steel, aluminum, brass, darkSteel } from '../utils/materials.js';

export function createPlanetaryGearbox(THREE) {
    const group = new THREE.Group();
    group.name = "PlanetaryGearbox";

    function createGear(radius, teeth, depth, material) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.8;
        for (let i = 0; i < teeth; i++) {
            const angle1 = (i / teeth) * Math.PI * 2;
            const angle2 = ((i + 0.5) / teeth) * Math.PI * 2;
            const angle3 = ((i + 1) / teeth) * Math.PI * 2;
            
            if (i === 0) shape.moveTo(Math.cos(angle1) * radius, Math.sin(angle1) * radius);
            else shape.lineTo(Math.cos(angle1) * radius, Math.sin(angle1) * radius);
            
            shape.lineTo(Math.cos(angle1 + 0.1) * innerRadius, Math.sin(angle1 + 0.1) * innerRadius);
            shape.lineTo(Math.cos(angle2 - 0.1) * innerRadius, Math.sin(angle2 - 0.1) * innerRadius);
            shape.lineTo(Math.cos(angle2) * radius, Math.sin(angle2) * radius);
        }
        
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius * 0.4, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, curveSegments: 4 });
        geo.center();
        return new THREE.Mesh(geo, material);
    }

    // Ring Gear
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, 4.5, 0, Math.PI * 2, false);
    const ringHole = new THREE.Path();
    const ringInnerRadius = 3.8;
    const ringTeeth = 36;
    for (let i = 0; i < ringTeeth; i++) {
        const angle1 = (i / ringTeeth) * Math.PI * 2;
        const angle2 = ((i + 0.5) / ringTeeth) * Math.PI * 2;
        
        if (i === 0) ringHole.moveTo(Math.cos(angle1) * ringInnerRadius, Math.sin(angle1) * ringInnerRadius);
        else ringHole.lineTo(Math.cos(angle1) * ringInnerRadius, Math.sin(angle1) * ringInnerRadius);
        
        ringHole.lineTo(Math.cos(angle1 + 0.05) * 4.0, Math.sin(angle1 + 0.05) * 4.0);
        ringHole.lineTo(Math.cos(angle2 - 0.05) * 4.0, Math.sin(angle2 - 0.05) * 4.0);
        ringHole.lineTo(Math.cos(angle2) * ringInnerRadius, Math.sin(angle2) * ringInnerRadius);
    }
    ringShape.holes.push(ringHole);
    const ringGeo = new THREE.ExtrudeGeometry(ringShape, { depth: 1, bevelEnabled: false, curveSegments: 8 });
    ringGeo.center();
    const ringGear = new THREE.Mesh(ringGeo, darkSteel);
    group.add(ringGear);

    // Carrier
    const carrier = new THREE.Group();
    carrier.name = "Carrier";
    group.add(carrier);

    const carrierPlateGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.4, 32);
    carrierPlateGeo.rotateX(Math.PI / 2);
    const carrierPlate = new THREE.Mesh(carrierPlateGeo, aluminum);
    carrierPlate.position.z = -0.8;
    carrier.add(carrierPlate);

    // Sun Gear
    const sunGearGroup = new THREE.Group();
    sunGearGroup.name = "SunGear";
    group.add(sunGearGroup);

    const sunGear = createGear(1.2, 12, 1, steel);
    sunGearGroup.add(sunGear);
    
    const sunShaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    sunShaftGeo.rotateX(Math.PI / 2);
    const sunShaft = new THREE.Mesh(sunShaftGeo, steel);
    sunShaft.position.z = 2;
    sunGearGroup.add(sunShaft);

    // Planet Gears
    const planetGears = [];
    for (let i = 0; i < 3; i++) {
        const planetGroup = new THREE.Group();
        planetGroup.name = `Planet_${i}`;
        const angle = (i / 3) * Math.PI * 2;
        planetGroup.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0);
        
        const planet = createGear(1.3, 12, 0.9, brass);
        planetGroup.add(planet);

        const pinGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
        pinGeo.rotateX(Math.PI / 2);
        const pin = new THREE.Mesh(pinGeo, steel);
        pin.position.z = -0.5;
        planetGroup.add(pin);

        carrier.add(planetGroup);
        planetGears.push(planetGroup);
    }

    function createRotationTrack(name, rotations, duration, numSteps = 32) {
        const times = [];
        const values = [];
        for (let i = 0; i <= numSteps; i++) {
            times.push((i / numSteps) * duration);
            const angle = (i / numSteps) * Math.PI * 2 * rotations;
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle);
            values.push(...q.toArray());
        }
        return new THREE.QuaternionKeyframeTrack(name, times, values);
    }

    const duration = 4;
    const tracks = [
        createRotationTrack('SunGear.quaternion', 3, duration),
        createRotationTrack('Carrier.quaternion', 1, duration)
    ];

    for(let j = 0; j < 3; j++) {
        tracks.push(createRotationTrack(`Planet_${j}.quaternion`, -2, duration));
    }

    const clip = new THREE.AnimationClip('GearAnimation', duration, tracks);

    return { group, animationClips: [clip] };
}
