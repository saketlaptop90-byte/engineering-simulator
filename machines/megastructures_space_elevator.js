import { steel, aluminum, carbonFiber, blueAccent, orangeAccent } from '../utils/materials.js';

export function createSpaceElevator(THREE) {
    const group = new THREE.Group();
    
    // Base Station
    const baseGeo = new THREE.CylinderGeometry(50, 60, 20, 32);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 10;
    group.add(base);

    // Tether
    const tetherGeo = new THREE.CylinderGeometry(2, 2, 400, 16);
    const tether = new THREE.Mesh(tetherGeo, carbonFiber);
    tether.position.y = 220;
    group.add(tether);

    // Counterweight Station
    const stationGeo = new THREE.SphereGeometry(30, 32, 32);
    const station = new THREE.Mesh(stationGeo, aluminum);
    station.position.y = 420;
    group.add(station);

    const ringGeo = new THREE.TorusGeometry(45, 5, 16, 64);
    const ring = new THREE.Mesh(ringGeo, blueAccent);
    ring.rotation.x = Math.PI / 2;
    station.add(ring);

    // Climber
    const climberGroup = new THREE.Group();
    climberGroup.name = "Climber";
    
    const climberBodyGeo = new THREE.CylinderGeometry(10, 10, 25, 16);
    const climberBody = new THREE.Mesh(climberBodyGeo, orangeAccent);
    climberGroup.add(climberBody);
    
    // Solar panels on climber
    const panelGeo = new THREE.BoxGeometry(30, 2, 10);
    const panel = new THREE.Mesh(panelGeo, aluminum);
    climberGroup.add(panel);

    climberGroup.position.y = 30; // Starts at bottom
    group.add(climberGroup);

    // Animation: Climber going up and down along the tether
    const times = [0, 5, 10]; // seconds
    const values = [
        0, 30, 0,  // t=0
        0, 400, 0, // t=5
        0, 30, 0   // t=10
    ];
    
    const positionTrack = new THREE.VectorKeyframeTrack('Climber.position', times, values);
    const clip = new THREE.AnimationClip('ElevatorMove', 10, [positionTrack]);

    return { group, animationClips: [clip] };
}
