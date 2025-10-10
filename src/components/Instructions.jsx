import PropTypes from 'prop-types'

function Instructions({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Instructions</h2>
        <p className="text-gray-500">No instructions available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 bg-black/70 backdrop-blur-sm my-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-wide">Instructions</h2>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-lg text-white leading-relaxed">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Instructions.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
};

export default Instructions;
