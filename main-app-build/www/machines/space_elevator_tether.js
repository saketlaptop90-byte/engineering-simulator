import { aluminum, titanium, glass } from '../utils/materials.js';

export function createSpaceElevator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Station
    const baseGeometry = new THREE.CylinderGeometry(50, 60, 20, 32);
    const base = new THREE.Mesh(baseGeometry, titanium);
    base.position.y = 10;
    group.add(base);

    // Tether
    const tetherGeometry = new THREE.CylinderGeometry(2, 2, 500, 16);
    const tether = new THREE.Mesh(tetherGeometry, aluminum);
    tether.position.y = 260;
    group.add(tether);

    // Climber
    const climberGeometry = new THREE.BoxGeometry(10, 15, 10);
    const climber = new THREE.Mesh(climberGeometry, glass);
    climber.position.y = 20;
    climber.name = "ElevatorClimber";
    group.add(climber);

    // Animation: Climber going up and down along the tether
    const climberTrack = new THREE.VectorKeyframeTrack(
        'ElevatorClimber.position',
        [0, 5, 10],
        [
            0, 20, 0,
            0, 480, 0,
            0, 20, 0
        ]
    );

    const climberClip = new THREE.AnimationClip('ClimberMove', 10, [climberTrack]);
    animationClips.push(climberClip);

    return { group, animationClips };
}
