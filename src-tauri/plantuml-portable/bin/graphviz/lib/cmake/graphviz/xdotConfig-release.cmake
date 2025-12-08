#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "graphviz::xdot" for configuration "Release"
set_property(TARGET graphviz::xdot APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(graphviz::xdot PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/xdot.lib"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/xdot.dll"
  )

list(APPEND _cmake_import_check_targets graphviz::xdot )
list(APPEND _cmake_import_check_files_for_graphviz::xdot "${_IMPORT_PREFIX}/lib/xdot.lib" "${_IMPORT_PREFIX}/bin/xdot.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
