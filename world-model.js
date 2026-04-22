#### World Model

```javascript

// Belief tracking with confidence scoring

Export class WorldModel {

  Beliefs = new Map(); // beliefId -> BeliefState

  

  updateBelief(belief, evidence, direction = ‘support’) {

    const current = this.beliefs.get(belief.id) || {

      confidence: 0.5,

      support: [],

      contradict: [],

      status: ‘speculative’

    };

    

    If (direction === ‘support’) {

      Current.support.push(evidence);

      Current.confidence = Math.min(1.0, current.confidence + 0.05);

    } else {

      Current.contradict.push(evidence);

      Current.confidence = Math.max(0.0, current.confidence – 0.08);

    }

    

    // Update status

    Current.status = 

      Current.confidence >= 0.8 ? ‘stable’ :

      Current.confidence <= 0.3 ? ‘weakened’ : ‘plausible’;

    

    This.beliefs.set(belief.id, current);

    Return current;

  }

  

  getPublishableBeliefs(minConfidence = 0.75) {

    return Array.from(this.beliefs.values())

      .filter(b => b.confidence >= minConfidence && b.status === ‘stable’);

  }

}

```
