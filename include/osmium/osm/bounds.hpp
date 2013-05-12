#ifndef OSMIUM_OSM_BOUNDS_HPP
#define OSMIUM_OSM_BOUNDS_HPP

/*

Copyright 2012 Jochen Topf <jochen@topf.org> and others (see README).

This file is part of Osmium (https://github.com/joto/osmium).

Osmium is free software: you can redistribute it and/or modify it under the
terms of the GNU Lesser General Public License or (at your option) the GNU
General Public License as published by the Free Software Foundation, either
version 3 of the Licenses, or (at your option) any later version.

Osmium is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Lesser General Public License and the GNU
General Public License for more details.

You should have received a copy of the Licenses along with Osmium. If not, see
<http://www.gnu.org/licenses/>.

*/

#include <osmium/osm/position.hpp>

namespace Osmium {

    namespace OSM {

        class Bounds {

        public:

            Bounds() :
                m_bottom_left(),
                m_top_right() {
            }

            Bounds(double left, double bottom, double right, double top) :
                m_bottom_left(left, bottom),
                m_top_right(right, top) {
            }

            Bounds& extend(const Position& position) {
                if (m_bottom_left.defined()) {
                    if (position.x() < m_bottom_left.x()) m_bottom_left.x(position.x());
                    if (position.x() > m_top_right.x()  ) m_top_right.x(position.x());
                    if (position.y() < m_bottom_left.y()) m_bottom_left.y(position.y());
                    if (position.y() > m_top_right.y()  ) m_top_right.y(position.y());
                } else {
                    m_bottom_left = position;
                    m_top_right = position;
                }
                return *this;
            }

            bool contains(const Position& position) const {
                return position.x() > m_bottom_left.x() && position.x() < m_top_right.x()
                        && position.y() > m_bottom_left.y() && position.y() < m_top_right.y();
            }

            bool defined() const {
                return m_bottom_left.defined();
            }

            /**
             * Bottom-left position.
             */
            Position bottom_left() const {
                return m_bottom_left;
            }

            /**
             * Top-right position.
             */
            Position top_right() const {
                return m_top_right;
            }

        private:

            Osmium::OSM::Position m_bottom_left;
            Osmium::OSM::Position m_top_right;

        }; // class Bounds

        inline std::ostream& operator<<(std::ostream& out, const Bounds& bounds) {
            out << '(' << bounds.bottom_left().lon() << ',' << bounds.bottom_left().lat() << ','
                << bounds.top_right().lon() << ',' << bounds.top_right().lat() << ')';
            return out;
        }

        inline std::istream& operator>>(std::istream& in, Bounds& bounds) {
            char c1, c2, c3;
            double left, bottom, right, top;

            in >> left >> c1 >> bottom >> c2 >> right >> c3 >> top;
            if (',' == c1 && ',' == c2 && ',' == c3) {
                bounds = Bounds(left, bottom, right, top);
            } else {
                in.clear(std::ios::badbit); // set error state
            }

            return in;
        }

    } // namespace OSM

} // namespace Osmium

#endif // OSMIUM_OSM_BOUNDS_HPP
