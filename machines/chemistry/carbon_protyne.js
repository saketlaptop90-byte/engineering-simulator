export const chem_c_protyne = {
    id: 'chem_c_protyne',
    name: 'Carbon - Protyne',
    type: 'chemistry',
    category: 'Chemistry',
    price: 82000,
    description: 'Protyne. A three-dimensional sp-sp3 hybridized carbon network, exhibiting wide bandgaps and high structural rigidity.',
    particles: '280 carbon atoms forming a complex cubic framework',
    connections: 'Linear sp chains bridging tetrahedral sp3 nodes',
    isPremium: true,
    
    init: function(engine) {
        this.engine = engine;
        this.particles = [];
        this.constraints = [];
        this.createStructure();
    },

    createStructure: function() {
        const count = parseInt(this.particles.match(/\d+/)[0]) || 250;
        const cx = 400, cy = 300;
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            let r = 80;
            // Differentiate spatial layout
            if (this.id === 'chem_c_haeckelite' || this.id === 'chem_c_kagome') {
                // Flat 2D disk
                r = 100 * Math.sqrt((i + 0.5) / count);
            } else if (this.id === 'chem_c_diaphite') {
                // Split distribution for diamond/graphite phase boundary
                r = 90 * (1 + 0.3 * Math.sin(phi * 4));
            } else {
                // 3D structural lattice
                r = 85 * (1 + 0.15 * Math.sin(theta * 6) * Math.cos(phi * 4));
            }
            
            let x = 0, y = 0;
            if (this.id === 'chem_c_haeckelite' || this.id === 'chem_c_kagome') {
                // Planar mapped
                x = r * Math.cos(theta * 10) + cx;
                y = r * Math.sin(theta * 10) + cy;
            } else {
                x = r * Math.sin(phi) * Math.cos(theta) + cx;
                y = r * Math.sin(phi) * Math.sin(theta) + cy;
            }
            
            // Phase coloring for Diaphite
            let isGraphitePhase = (this.id === 'chem_c_diaphite' && x > cx);
            
            const particle = this.engine.addParticle(x, y, {
                mass: 12.011,
                radius: 6,
                restitution: 0.88,
                friction: 0.05,
                color: isGraphitePhase ? '#1a1a1a' : '#3b3b3b',
                label: 'C',
                element: 'Carbon'
            });
            
            particle.vx = (Math.random() - 0.5) * 0.3;
            particle.vy = (Math.random() - 0.5) * 0.3;
            
            this.particles.push(particle);
        }
        
        const connectThreshold = this.id === 'chem_c_kagome' ? 35 : 45;
        
        for (let i = 0; i < this.particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < connectThreshold && connections < 4) {
                    const bond = this.engine.addConstraint(p1, p2, {
                        stiffness: 0.85,
                        damping: 0.05,
                        length: dist,
                        color: 'rgba(0, 255, 255, 0.25)',
                        width: 1.5
                    });
                    this.constraints.push(bond);
                    connections++;
                }
            }
        }
    },
    
    update: function(dt) {
        const time = Date.now() * 0.001;
        const cx = 400, cy = 300;
        
        this.particles.forEach((p, i) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 30) {
                p.vx -= (dx / dist) * 0.04 * (1 + 0.1 * Math.sin(time * 2 + i));
                p.vy -= (dy / dist) * 0.04 * (1 + 0.1 * Math.cos(time * 2 + i));
            }
            
            // Subtle quantum-like vibrations
            p.vx += Math.sin(time * 4 + i * 0.4) * 0.12;
            p.vy += Math.cos(time * 4 + i * 0.4) * 0.12;
            
            if (this.id.includes('kagome') || this.id.includes('haeckelite')) {
                // Gentle spin for flat models
                p.vx += (dy / dist) * 0.1;
                p.vy -= (dx / dist) * 0.1;
            }
        });
    },

    draw: function(ctx) {
        ctx.beginPath();
        this.constraints.forEach(c => {
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.particles.forEach(p => {
            const baseColor = p.color; // Allows custom color per phase
            
            const gradient = ctx.createRadialGradient(p.x - p.radius*0.2, p.y - p.radius*0.2, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#555555');
            gradient.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
            ctx.fill();
            
            ctx.fillStyle = '#00ffff';
            ctx.font = '7px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x, p.y);
        });
    }
};
