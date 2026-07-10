import { titanium, steel, copper } from '../utils/materials.js';

export function createLiquidRocket(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Combustion Chamber
    const chamberGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const chamberMat = titanium.clone();
    chamberMat.side = THREE.DoubleSide;
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 1;
    group.add(chamber);

    // Engine Bell (Nozzle) using mathematical profile
    const bellPoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        const t = i / 20;
        const x = 0.5 + Math.pow(t, 1.5) * 2.0; // Expansion curve
        const y = -t * 4;
        bellPoints.push( new THREE.Vector2( x, y ) );
    }
    const bellGeo = new THREE.LatheGeometry(bellPoints, 32);
    const bellMat = steel.clone();
    bellMat.side = THREE.DoubleSide;
    const bell = new THREE.Mesh(bellGeo, bellMat);
    group.add(bell);

    // Turbopump Assembly
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const pump = new THREE.Mesh(pumpGeo, copper);
    pump.position.set(1.5, 1, 0);
    pump.name = "turbopump";
    group.add(pump);

    // Cooling/Fuel Piping
    const pipeGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16, Math.PI);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    pipe.position.set(0.7, 1, 0);
    group.add(pipe);
    
    // Injector Plate
    const plateGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 32);
    const plate = new THREE.Mesh(plateGeo, copper);
    plate.position.y = 0.9;
    group.add(plate);

    // Supersonic Exhaust Plume with Shock Diamonds
    const plumeGroup = new THREE.Group();
    plumeGroup.name = "rocketPlume";
    for(let i=0; i<5; i++) {
        const diamondGeo = new THREE.ConeGeometry(2.2 - i*0.2, 2.5, 32);
        const diamondMat = new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.7 - i*0.12, blending: THREE.AdditiveBlending });
        
        const diamond1 = new THREE.Mesh(diamondGeo, diamondMat);
        diamond1.position.y = -5 - i*2.5;
        
        const diamond2 = new THREE.Mesh(diamondGeo, diamondMat);
        diamond2.rotation.x = Math.PI;
        diamond2.position.y = -6.25 - i*2.5;
        
        plumeGroup.add(diamond1);
        plumeGroup.add(diamond2);
    }
    group.add(plumeGroup);

    // Animation Tracks
    const times = [0, 0.1, 0.2];
    
    // Plume oscillation (throbbing effect)
    const plumeScaleValues = [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1];
    const plumeTrack = new THREE.VectorKeyframeTrack('rocketPlume.scale', times, plumeScaleValues);

    // Fast rotating turbopump
    const pumpTimes = Array.from({length: 11}, (_, i) => i * 0.02);
    const pumpRotQuats = [];
    for(let i=0; i<=10; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i/10) * Math.PI * 2);
        pumpRotQuats.push(q.x, q.y, q.z, q.w);
    }
    const pumpTrack = new THREE.QuaternionKeyframeTrack('turbopump.quaternion', pumpTimes, pumpRotQuats);

    const clip = new THREE.AnimationClip('RocketBurn', 0.2, [plumeTrack, pumpTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
