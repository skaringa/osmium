#ifndef OSMIUM_HANDLER_CLIPS_BOUNDS_HPP
#define OSMIUM_HANDLER_CLIPS_BOUNDS_HPP

#include <osmium/handler.hpp>
#include <osmium/osm/bounds.hpp>

namespace Osmium {

    namespace Handler {

        /**
         * Handler to pass only nodes that are inside a given bounding box
         *
         */
    	template <class THandler>
        class ClipBounds : public Osmium::Handler::Forward<THandler> {

        public:
            ClipBounds(THandler& next_handler, Osmium::OSM::Bounds& bounds) :
                Forward<THandler>(next_handler),
                m_bounds(bounds) {
                std::cout << "Clipping input to bounds " << m_bounds << std::endl;
            }

            void node(const shared_ptr<Osmium::OSM::Node>& node) const {
                if (m_bounds.contains(node->position())) {
                    Forward<THandler>::next_handler().node(node);
                }
            }

        private:
            Osmium::OSM::Bounds m_bounds;
        }; // class ClipBounds

   } // namespace Handler

} // namespace Osmium

#endif // OSMIUM_HANDLER_CLIPS_BOUNDS_HPP
