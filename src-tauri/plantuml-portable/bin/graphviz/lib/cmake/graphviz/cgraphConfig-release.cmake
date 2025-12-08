#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "graphviz::cgraph" for configuration "Release"
set_property(TARGET graphviz::cgraph APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(graphviz::cgraph PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/cgraph.lib"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/cgraph.dll"
  )

list(APPEND _cmake_import_check_targets graphviz::cgraph )
list(APPEND _cmake_import_check_files_for_graphviz::cgraph "${_IMPORT_PREFIX}/lib/cgraph.lib" "${_IMPORT_PREFIX}/bin/cgraph.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
