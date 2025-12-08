#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "graphviz::pathplan" for configuration "Release"
set_property(TARGET graphviz::pathplan APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(graphviz::pathplan PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/pathplan.lib"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/pathplan.dll"
  )

list(APPEND _cmake_import_check_targets graphviz::pathplan )
list(APPEND _cmake_import_check_files_for_graphviz::pathplan "${_IMPORT_PREFIX}/lib/pathplan.lib" "${_IMPORT_PREFIX}/bin/pathplan.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
